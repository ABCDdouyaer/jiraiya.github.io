## 创建动态链接库

> 动态链接库可以大大的减少webpack对项目的构建速度

### 要给 Web 项目构建接入动态链接库的思想，需要完成以下事情：

- 把网页依赖的基础模块抽离出来，打包到一个个单独的动态链接库中去。一个动态链接库中可以包含多个模块。

- 当需要导入的模块存在于某个动态链接库中时，这个模块不能被再次被打包，而是去动态链接库中获取。

- 页面依赖的所有动态链接库需要被加载。

为什么给 Web 项目构建接入动态链接库的思想后，会大大提升构建速度呢？ 原因在于包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会在重新编译，而是直接使用动态链接库中的代码。 由于动态链接库中大多数包含的是常用的第三方模块，例如 react、react-dom，只要不升级这些模块的版本，动态链接库就不用重新编译。


### dll生成配置

```
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
module.exports = {
    mode: "development",
    context: path.resolve(__dirname, 'src'),//webpack开始解析的路径
    entry: {
        'react': ['react', 'react-dom'],
    },
    output: {
        filename: 'static/[name].dll.js',
        path: path.resolve(__dirname, 'dist'),
        library: '_dll_[name]'//全局定义的变量
    },
    plugins: [
        new DllPlugin({
            context: path.resolve(__dirname, 'src'),//manifest 文件中请求的上下文(context)(默认值为 webpack 的上下文(context))
            name: '_dll_[name]',//json文件用于引用的变量名 同library对应
            path:path.resolve(__dirname, 'dist/static', '[name].manifest.json')//生成的动态链接库文件输出地址
        })
    ]
}
```

### 业务打包配置

```
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
    ]
}
```