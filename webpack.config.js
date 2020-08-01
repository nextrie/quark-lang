const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts' ],
    alias: {
      other: path.resolve(__dirname, 'src/other'),
      vm: path.resolve(__dirname, 'src/vm'),
      tokens: path.resolve(__dirname, 'src/core/tokens/tokens.ts'),
      core: path.resolve(__dirname, 'src/core'),
      utils: path.resolve(__dirname, 'src/utils'),
      tests: path.resolve(__dirname, 'tests')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};