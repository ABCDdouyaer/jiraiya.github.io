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