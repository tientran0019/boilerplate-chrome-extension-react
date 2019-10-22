/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2019-10-18 11:37:55
*------------------------------------------------------- */

import React from 'react';
// import PropTypes from 'prop-types';

import Greetings from 'src/components/Greetings';

import classes from './index.scss';

const Popup = (props) => {
	// const { } = props;

	return (
		<div className={classes.wrapper}>
			<h1>This is the Popup Window</h1>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Greetings />
			</div>
		</div>
	);
};

Popup.propTypes = {
	// classes: PropTypes.object.isRequired,
};

Popup.defaultProps = {
	// classes: {},
};

export default Popup;
