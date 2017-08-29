let webpack = require('webpack');
let path = require('path');

module.exports = {
  entry:[
    'babel-polyfill',
    './src/index.js',
    './src/style.css'
  ],
  output:{
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warning: false,
        unused: true,
      },
      mangle: false,
      beautify: true,
      output:{
        comments:true,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ],
  module:{
    rules:[
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