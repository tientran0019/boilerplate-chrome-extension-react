/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const ExtensionReloader = require('webpack-extension-reloader');

const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const PORT = process.env.PORT || 3000;

const options = config.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

for (const entryName in config.entry) {
	if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
		config.entry[entryName] = [
			'webpack-dev-server/client?http://localhost:' + PORT,
			'webpack/hot/dev-server',
		].concat(config.entry[entryName]);
	}
}

config.devtool = 'eval-source-map';

config.plugins = [new webpack.HotModuleReplacementPlugin(), new ExtensionReloader()].concat(
	config.plugins || [],
);

delete config.chromeExtensionBoilerplate;

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
	hot: true,
	contentBase: path.join(__dirname, '../build'),
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
	disableHostCheck: true,
});

server.listen(PORT);
