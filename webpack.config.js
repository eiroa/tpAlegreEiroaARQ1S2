var path = require('path');

module.exports = {
    entry: './src/js/app.jsx',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
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


//1 instalar por afuera todas las dependencias
//2 agregar webpack.config
// 3 editar en module loaders...
//
//loader: 'babel',
//query:
//    {
//      presets:['es2015','react']
//    }

// 4 npm install babel-preset-es2015 --save --no-bin-links  
// 5 npm install babel-preset-react --save --no-bin-links

//6 agregar el archivo client.js

// agregar la carpeta api con los dos archivos uri

// finalmente ejecutar webpack

