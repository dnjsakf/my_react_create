let webpack = require('webpack');
let path = require('path');

module.exports = {
  entry:[
    './src/index.js',
    './src/style.css'
  ],
  output:{
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer:{
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public'),
    proxy: {
      // 최신 버전에서는 "**"을 사용한다.
      // express port와 일치 시켜줘야한다.
      "**": "http://localhost:8080"
    },
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:[
          'react-hot-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options:{
          presets:[
            'react',
            'es2015'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}