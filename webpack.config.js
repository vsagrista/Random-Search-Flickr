module.exports = {
  entry: ["./app/components/Main.js",
          "./CSS/style.css"],
  output: {
        publicPath: 'http://localhost:3000/',
        filename: 'build/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
}