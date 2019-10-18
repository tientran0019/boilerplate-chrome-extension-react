import React from 'react';
import { render } from 'react-dom';

import Popup from 'src/containers/Popup';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));
