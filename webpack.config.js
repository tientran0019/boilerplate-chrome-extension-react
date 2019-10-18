const webpack = require('webpack');
const path = require('path');
const fileSystem = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const env = require('./scripts/env');

// load the secrets
const alias = {
	'react-dom': '@hot-loader/react-dom',
};

const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

const fileExtensions = [
	'jpg',
	'jpeg',
	'png',
	'gif',
	'eot',
	'otf',
	'svg',
	'ttf',
	'woff',
	'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
	alias.secrets = secretsPath;
}

const options = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		newtab: path.join(__dirname, 'src', 'extension', 'newtab', 'index.js'),
		options: path.join(__dirname, 'src', 'extension', 'options', 'index.js'),
		popup: path.join(__dirname, 'src', 'extension', 'popup', 'index.js'),
		inject: path.join(__dirname, 'src', 'extension', 'inject', 'index.js'),
		background: path.join(__dirname, 'src', 'extension', 'background', 'index.js'),
		contentScript: path.join(__dirname, 'src', 'extension', 'content', 'index.js'),
	},
	chromeExtensionBoilerplate: {
		notHotReload: ['contentScript'],
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				exclude: /node_modules/,
			},
			{
				test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
				loader: 'file-loader?name=[name].[ext]',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		alias,
		extensions: fileExtensions
			.map((extension) => '.' + extension)
			.concat(['.jsx', '.js', '.css']),
	},
	plugins: [
		new webpack.ProgressPlugin(),
		// clean the build folder
		new CleanWebpackPlugin({
			verbose: true,
			// cleanStaleWebpackAssets: false,
		}),
		// expose and write the allowed env vars on the compiled bundle
		new webpack.EnvironmentPlugin(['NODE_ENV']),
		new CopyWebpackPlugin(
			[
				{
					from: `src/extension/${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}.manifest.json`,
					to: path.join(__dirname, 'build/manifest.json'),
					force: true,
					transform(content) {
						// generates the manifest file using the package.json informations
						return Buffer.from(
							JSON.stringify({
								description: process.env.npm_package_description,
								version: process.env.npm_package_version,
								...JSON.parse(content.toString()),
							}),
						);
					},
				},
				{
					from: 'src/assets',
					to: path.join(__dirname, 'build'),
					force: true,
				},
			],
			{
				logLevel: 'info',
				copyUnmodified: true,
			},
		),
		new CopyWebpackPlugin(
			[
				{
					from: 'src/extension/content/content.styles.css',
					to: path.join(__dirname, 'build'),
					force: true,
				},
			],
			{
				logLevel: 'info',
				copyUnmodified: true,
			},
		),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'newtab', 'index.html'),
			filename: 'newtab.html',
			chunks: ['newtab'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'options', 'index.html'),
			filename: 'options.html',
			chunks: ['options'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'popup', 'index.html'),
			filename: 'popup.html',
			chunks: ['popup'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'inject', 'index.html'),
			filename: 'inject.html',
			chunks: ['inject'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(
				__dirname,
				'src',
				'extension',
				'background',
				'index.html',
			),
			filename: 'background.html',
			chunks: ['background'],
		}),
		new WriteFilePlugin(),
	],
};

if (env.NODE_ENV === 'development') {
	options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
