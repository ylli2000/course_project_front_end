const path = require('path');
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
//const BrowserSyncPlugin = require('browser-sync-webpack-plugin'); //Dev Only
module.exports = {
    mode: 'production', //Production Only so webpack gives more meaningful error messages
    entry: './src/app.ts',
    output: {
        filename: '[name].[contenthash].js', //[app].[contenthash].js
        path: path.resolve(__dirname, 'public'), //webpack wants absolute path, dev-server is running in memory only
        //publicPath: 'public',
        clean: true //Prod Only
    },
    //devtool: 'inline-source-map', //Dev Only put source map in compiled js files
    module: {
        rules: [
            { //tell webpack how to deal with import ts files
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            { //tell webpack how to deal with import css files
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/
            },
            { //tell webpack how to deal with import tpl files 
              //(also checkout tpl.d.ts)
                test: /\.tpl$/,
                exclude: /node_modules/,
                use: {loader: 'raw-loader'}
            }
        ]
    },
    resolve: { //webpack will look for files with these extensions
        extensions: ['.ts', '.js']
    },
    plugins: [
        new Dotenv(),
        new FaviconsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: './index.html'
        }),
        // new BrowserSyncPlugin({ // Dev Only Plugin
        //     // refresh dev server when code changes
        //     // ./public directory is being served
        //     host: 'localhost',
        //     port: 8080,
        //     ui: false,
        //     server: { baseDir: ['public'] }
        // })
    ]
};