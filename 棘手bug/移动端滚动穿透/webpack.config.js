const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//打包前清除dist
module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      // chunks(chunk){
      //   console.log(chunk.name)
      // },
      chunks: 'all',//声明需要优化的chunk同步异步和所有
      minSize: 30000,//模块的尺寸大于30kb
      maxSize: 0,//优先级 maxInitialRequest/maxAsyncRequests < maxSize < minSize
      minChunks: 1,//被引入的模块次数大于等于1
      maxAsyncRequests: 5,//按需加载的最大并行请求数
      maxInitialRequests: 3,//入口点的最大并行请求数
      automaticNameDelimiter: '_',//抽离的公共内容的文件命名分隔符
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        commons: {
          test: /[\\/]common[\\/]/,
          name: 'common',
          priority: -10,
          enforce: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  entry: {
    'index': './src/index.js',
  },
  output:{
    filename:'[name].js',
    path:path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-syntax-dynamic-import']
        }
      }
    },
    {
      test: /\.s?css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
    },
    {
      test: /\.(jpg|gif|jpeg|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 1080,
            fallback: 'file-loader',
            outputPath: 'images',
            publicPath: '../images'
          }
        }
      ]
    },]
  },
  plugins:[
    new CleanWebpackPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks:['index', 'vendors_index']
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
      host: '10.205.96.252',
      port: 8080,
      contentBase: './dist',
      hot: true,
      open: true,
  }
}