/* eslint-disable import/no-extraneous-dependencies */
// Do this as the first thing so that any code reading it knows the right env.
const webpack = require('webpack');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


const config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

webpack(config, (err) => {
	if (err) throw err;
});
