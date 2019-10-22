/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2019-10-18 20:00:51
*------------------------------------------------------- */

import React from 'react';
// import PropTypes from 'prop-types';

const Inject = (props) => {
	// const { } = props;

	return (
		<div className="name">
			<img src={chrome.extension.getURL('icons/icon-48.png')} alt="icon" />
		</div>
	);
};

Inject.propTypes = {
	// classes: PropTypes.object.isRequired,
};

Inject.defaultProps = {
	// classes: {},
};

export default Inject;
