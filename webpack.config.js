var path = require('path');
var webpack = require('webpack');
var minimize = process.argv.indexOf('--minimize') !== -1;
module.exports = {
    entry: './src/js/app.jsx',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
          minimize: true
        })
      ],
    resolve: {
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        }
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                query:
                    {
                      presets:['es2015','react']
                    }
            }
        ]
    }
};


