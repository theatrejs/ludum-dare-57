const {merge} = require('webpack-merge');
const path = require('path');

function configuration() {

    return merge(require('./webpack.common.js')(), {

        'devServer': {

            'client': {

                'logging': 'warn'
            },
            'devMiddleware': {

                'publicPath': '/bundle'
            },
            'static': {

                'directory': path.resolve(__dirname, 'distribution')
            }
        },
        'devtool': 'inline-source-map',
        'mode': 'development'
    });
}

module.exports = configuration;
