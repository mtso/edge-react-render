const path = require('path')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = [
  {
    mode: 'development',
    entry: {
      bundle: path.join(__dirname, './app/client'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: [
              "@babel/preset-env", "@babel/preset-react"
            ]
          }
        }
      ]
    },
    resolve: {
      extensions: [ '.js', '.jsx' ],
    },
    plugins: [
      new ManifestPlugin(),
    ]
  },
  {
    mode: 'development',
    entry: {
      render: path.join(__dirname, 'app/render'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[hash].js',
      library: 'render',
      libraryTarget: 'commonjs',
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: [
              "@babel/preset-env", "@babel/preset-react"
            ]
          }
        }
      ]
    },
    resolve: {
      extensions: [ '.js', '.jsx' ],
    },
    plugins: [
      new ManifestPlugin({
        fileName: 'manifest-render.json',
      }),
    ]
  }
]
