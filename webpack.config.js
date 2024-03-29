/* eslint-disable prefer-object-spread */
const webpack = require('webpack');
const path = require('path');
const concat = require('lodash/concat');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const autoprefixer = require('autoprefixer');
const glob = require('glob');

const { env } = process;

// load the secrets
const alias = {
	'react-dom': '@hot-loader/react-dom',
};

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

const overrides = glob.sync(path.join(__dirname, 'src/extension/overrides/**/index.js')).reduce((acc, p) => {
	const name = p.replace('/index.js', '').split('/');
	acc['overrides/' + name[name.length - 1]] = p;
	return acc;
}, {});

const pages = glob.sync(path.join(__dirname, 'src/extension/pages/**/index.js')).reduce((acc, p) => {
	const name = p.replace('/index.js', '').split('/');
	acc['pages/' + name[name.length - 1]] = p;
	return acc;
}, {});

const entry = Object.assign({
	popup: path.join(__dirname, 'src', 'extension', 'popup', 'index.js'),
	background: path.join(__dirname, 'src', 'extension', 'background', 'index.js'),
	'content-script': path.join(__dirname, 'src', 'extension', 'content', 'index.js'),
}, overrides, pages);

const overridesHtml = glob.sync(path.join(__dirname, 'src/extension/overrides/**/index.html')).reduce((acc, p) => {
	const name = p.replace('/index.html', '').split('/');

	acc.push(new HtmlWebpackPlugin({
		template: p,
		filename: '../overrides/' + name[name.length - 1] + '.html',
		chunks: ['overrides/' + name[name.length - 1]],
	}));

	return acc;
}, []);

const pagesHtml = glob.sync(path.join(__dirname, 'src/extension/pages/**/index.html')).reduce((acc, p) => {
	const name = p.replace('/index.html', '').split('/');

	acc.push(new HtmlWebpackPlugin({
		template: p,
		filename: '../pages/' + name[name.length - 1] + '.html',
		chunks: ['pages/' + name[name.length - 1]],
	}));

	return acc;
}, []);

const options = {
	mode: process.env.NODE_ENV || 'development',
	entry,
	chromeExtensionBoilerplate: {
		notHotReload: ['content-script'],
	},
	output: {
		path: path.join(__dirname, 'build/js'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: process.env.NODE_ENV === 'production' ? true : {
								mode: 'local',
								localIdentName: '[folder]__[local]__[hash:base64:5]',
								context: path.resolve(__dirname, 'src'),
							},
							sourceMap: process.env.NODE_ENV !== 'production',
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer],
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
				include: /node_modules/,
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: process.env.NODE_ENV === 'production' ? true : {
								mode: 'local',
								localIdentName: '[folder]__[local]__[hash:base64:5]',
								context: path.resolve(__dirname, 'src'),
							},
							sourceMap: process.env.NODE_ENV !== 'production',
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer],
						},
					},
					{
						loader: 'sass-loader',
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
				include: /node_modules/,
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
	plugins: concat([
		// Read the .env file
		new Dotenv({
			path: path.join(__dirname, '.env'),
			systemvars: true,
		}),
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
					to: path.join(__dirname, 'build/styles'),
					force: true,
				},
			],
			{
				logLevel: 'info',
				copyUnmodified: true,
			},
		),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'popup', 'index.html'),
			filename: '../popup.html',
			chunks: ['popup'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'extension', 'background', 'index.html'),
			filename: '../background.html',
			chunks: ['background'],
		}),
		new WriteFilePlugin(),
	], pagesHtml, overridesHtml),
};

if (env.NODE_ENV === 'development') {
	options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
