- **name:** 指定抽离出来的代码合并到哪个chunk中去，如果指定的名字不存在，则直接创建一个新的chunk

- **filename:** 指定抽离出来的代码文件名字，优先级高于name

- **chunks:** 指定从哪些chunk中提取公共模块，默认是入口chunks

- **minChunks:** 

        number: 被引用次数超过几次的模块

        Infinity: 提取manifest时候设置

        function: (modules, count){} modules返回当前模块的信息，modules.resource为资源绝对路径 count返回当前模块在出口处总共被引用的次数

- **children:** 入口文件的所引用的子模块统统被作为抽离公共部分的目标，和chunks只能用其一

- **async:** boolean true将异步模块抽离出来，require.ensure([],function(){},(err)=>{}, 打包到的chunk名)

- **miniSize:** 公共模块的最小尺寸

#### 通过抽离可以将模块分为五个部分：业务代码，公共代码， node包代码， webpack自定义方法， 异步代码


```
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
```