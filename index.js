'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');

function addFragmentsToQuery(content, dirname) {
    const matches = [...content.matchAll(/\.{3}/g)];
    const usedFragments = matches.map(el => {
        let start = el.index;
        let end = content.indexOf(os.EOL, start);
        return content.substring(start + 3, end);
    });
    return Array.from((new Set(usedFragments)).values())
        .filter(name => {
            return fs.existsSync(`${dirname}fragments/${name}.gql`);
        }).reduce((acc, name) => {
            acc += ` ${fs.readFileSync(`${dirname}fragments/${name}.gql`, 'utf-8').replace(/\n|\r/g, ' ')}`;
            return acc;
        }, '');
}

function parseQueries(dirname, to) {
    let baseTempalte = `module.exports = {
        addVariables: function (name, variables) {
            if (!this[name]) throw new Error('empty query');
            if (!variables) return this[name];
            return this[name].replace('"valiables":{}', '"variables":' + JSON.stringify(variables));
        },${os.EOL}`;
    fs.readdirSync(path.join(process.cwd(), dirname))
        .filter(name => name.indexOf('.gql') !== -1)
        .forEach((filename, index, queries) => {
            let content = fs.readFileSync(dirname + filename, 'utf-8');
            let contentReplaced = content.replace(/\n|\r/g, ' ');
            if (content.indexOf('...') !== -1) {
                contentReplaced += addFragmentsToQuery(content, dirname);
            }
            baseTempalte += `${filename.replace('.gql', '')}:'{"query":"${contentReplaced}","valiables":{}}'`;
            if (queries.length === (index + 1)) {
                baseTempalte += `${os.EOL}};${os.EOL}`;
                fs.writeFileSync(to, baseTempalte);
            } else {
                baseTempalte += `,${os.EOL}`;
            }
        });
}

module.exports = parseQueries;
