# graphql-to-string

## Description

A simple module to create a string for HTTP request of the .gql file with graphql query. Module reads .gql files and transpile them to single common js module where all queries can be read as a string and extended with variables.

## Installation

`$ npm i graphql-to-string -g`

## Usage

In command line run graphql-to-string command with two arguments: first folder with .gql files and second file to compile queries to. .gql saved in nested folders won't be read, only .gql files in a given folder.

```javascript
graphql-to-string ./query/ ./query/queries.js
```

All queries will become properties ob an export object in the result file with the same name they were in the folder.

Read file where queries were compiled as CommonJs module and use function addVariable to attach variables to query.

```javascript
const queries = require('./queries.js');
const requestBody = queries.addVariable('test', {
    input: {
        test: 1
    }
});
// send requestBody to graphql server
```

## Fragments usage
Fragments should be kept in fragments folder in a folder with queries and fragment file must have the same name as a file in fragments folder.

Example

#### Folder structure
```javascript
query
----fragments
------testFields.gql
----query.gql
```

#### query.gql
```javascript
query GetSongs {
    ...songs
}
```

#### songs.gql
```javascript
fragment songs on Metallica {
    master
    unforgiven
}
```
