import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';

// Get directory name equivalent using ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Webpack configuration
export default {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: {
      vue: '@vue/runtime-dom',
      '@': path.resolve(__dirname, 'src') // Add convenient alias
    },
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    hot: true,
  },
  mode: process.env.NODE_ENV || 'development',
};