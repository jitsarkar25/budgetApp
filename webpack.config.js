var webpack = require('webpack');

module.exports = {
  entry: "./app2.js",
  output: {
    path: __dirname + "/js",
    filename: "scripts.min.js"
  },
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
  },    
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  devtool: 'eval-source-map'
};