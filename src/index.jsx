import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

import { App } from './app/Index';

import './styles.less';

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

render(
    <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app')
);