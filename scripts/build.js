/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const webpack = require('webpack');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


const config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

webpack(config, (err) => {
	if (err) throw err;
});
