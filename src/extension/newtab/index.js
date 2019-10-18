import React from 'react';
import { render } from 'react-dom';

import Newtab from 'src/containers/Newtab';

import './index.css';

render(<Newtab />, window.document.querySelector('#app-container'));
