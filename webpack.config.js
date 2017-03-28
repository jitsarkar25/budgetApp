var debug = process.env.NODE_ENV === "production";

var webpack = require('webpack');

module.exports = {
  context: __dirname,
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
    },
  ]
},    
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};