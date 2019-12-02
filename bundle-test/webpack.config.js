const path = require('path');

module.exports = {
    mode: 'production',
    output: {
        filename: 'index.js'
    },
    resolve: {
        alias: {
            'merge-graphql-schemas': path.join(__dirname, '../dist')
        },
        modules: ['node_modules', '../node_modules']
    },
    externals: {
        fs: 'empty'
    }
};
