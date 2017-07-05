module.exports = {
  output: {
    filename: 'bundle.min.js'
  }, 
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader',
        exclude: /node_modules/, 
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js']
    }
  },
  target: 'node'
}