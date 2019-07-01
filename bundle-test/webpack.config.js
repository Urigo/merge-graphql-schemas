const path = require('path');

module.exports = {
    target: 'node',
    output: {
        filename: 'index.js'
    },
    resolve: {
        alias: {
            'merge-graphql-schemas': path.join(__dirname, '../dist/index.esm.js')
        },
        modules: ['node_modules', '../node_modules']
    }
}