import React, { Component } from 'react';
import classes from './index.scss';

class Newtab extends Component {
	state = {
		reactVersion: '16.10',
		webpackVersion: '4',
	}

	render() {
		const { reactVersion, webpackVersion } = this.state;

		return (
			<div className={classes.newtabContainer}>
				<p>This is the new tab page.</p>
				<p>
					It uses{' '}
					<a
						href="https://reactjs.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						React {reactVersion}
					</a>{' '}
					and{' '}
					<a
						href="https://webpack.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Webpack {webpackVersion}
					</a>
					.
				</p>
			</div>
		);
	}
}

export default Newtab;
