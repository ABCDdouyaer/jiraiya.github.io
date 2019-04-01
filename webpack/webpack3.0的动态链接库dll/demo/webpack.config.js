const path = require('path')
const DllReferenvePlugin = require('webpack/lib/DllReferencePlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: "development",
    context: path.resolve(__dirname, 'src'),//webpack开始解析的路径
    entry: {
        'index': './index.js',//由于设置了上下文路径必须用相对路径
    },
    output: {
        filename: 'static/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                use:[{
                    loader: 'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }],
                exclude: path.resolve(__dirname, 'node_modules')
            }
        ]
    },
    plugins: [
        new DllReferenvePlugin({
            manifest: require('./dist/static/react.manifest.json'),
        }),
        new HtmlWebpackPlugin({
            template: '../template.html',//由于设置了上下文路径，相对于上下文,
            filename: 'index.html'
        })
    ],
    devServer:{
        
    }
}