/**
 * Created by noonon on 6/12/16.
 */
/**
 * Created by noonon on 12/11/15.
 */

var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin'),
    path = require('path'),
    webpack = require('webpack');

module.exports = {

    context: path.join(__dirname, 'frontend'),
    entry: [
        './index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'public', 'build'),
        publicPath: "/build/",
        filename: '/index.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.html$/,
                name: "mandrillTemplates",
                loader: 'raw!html-minify'
            },
            {test: /\.json$/, loader: 'json-loader'},
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            },
            {
                test: /\.css/,
                loader: 'css-loader!stylus-loader'
            },
            {
                test: /\.(ttf|otf|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }/*,
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }*/
        ]
    },
    resolve: {
        root: path.join(__dirname, 'frontend'),
        modulesDirectories: [
            "node_modules"]
    },
    /*plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false,
            compress: {
                warnings: false
            }
        })
    ]*/
};