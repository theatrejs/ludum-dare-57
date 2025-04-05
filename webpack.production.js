const {merge} = require('webpack-merge');

function configuration() {

    return merge(require('./webpack.common.js')(), {

        'devtool': 'source-map',
        'mode': 'production'
    });
}

module.exports = configuration;
