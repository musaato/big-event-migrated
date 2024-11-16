

// The original project was written in Vue, I rewrite it by React.

import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
// stylize globally(top,left,right margin will gone)
import 'normalize.css'
import './index.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // redux store
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);


