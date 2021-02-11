#!/usr/bin/env node

const from = process.argv[2];
const to = process.argv[3];

const parseQueries = require('../index');

try {
    parseQueries(from, to);
    console.log(`JS file ${to} has been created`);
    process.exit(0);
} catch (err) {
    console.log(err);
    process.exit(1);
}
