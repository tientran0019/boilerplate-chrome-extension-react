// Content script works!
// Must reload extension for modifications to take effect.

import React from 'react';
import { render } from 'react-dom';

import Inject from 'src/containers/Inject';

window.addEventListener('load', () => {
	const injectDOM = document.createElement('div');
	injectDOM.id = 'inject-app';
	injectDOM.style.all = 'unset';
	document.body.appendChild(injectDOM);
	render(<Inject />, injectDOM);
});
