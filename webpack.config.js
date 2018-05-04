export default {
 mode: 'development',
 context: __dirname + '/app/assets',
 entry: {
  'app': __dirname + '/app/assets/js/app.js'
 },
 output: {
  path: __dirname + '/dist/assets/js/',
  filename: '[name].js'
 },
 module: {
  rules: [
   {
    test: /\.js$/,
    exclude: /node_modules/,
    enforce: 'pre',
    loader: 'babel-loader',
    query: {
     presets: ['es2015']
    }
   }
  ]
 }
};
