const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    entry: {
        'index': './src/index.js',
        'home': './src/home.js',
        'admin': './src/admin.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].js',//定义异步代码的输出文件名
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vender',//提取node_modules下的代码
            minChunks:function(module, count){
                console.log(module.resource,count)
                return /node_modules/.test(module.resource)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'mainfest',//提取webpack方法
            minChunks: 'Infinity',
            chunks:['vender']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',//提取公共代码
            minChunks: 2,
            chunks: ['index', 'home', 'admin']
        }),
        new webpack.optimize.CommonsChunkPlugin({
           children: true,//提取异步代码
           async: 'asc',
        }),
        new BundleAnalyzerPlugin()
    ]
}