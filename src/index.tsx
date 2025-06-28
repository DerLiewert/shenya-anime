import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import 'swiper/scss';
import 'lightgallery/scss/lightgallery.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import './styles/global.scss';
import App from './App';
import { SkeletonTheme } from 'react-loading-skeleton';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Router>
    <Provider store={store}>
      <SkeletonTheme baseColor="#1c1c1c" highlightColor="#3a3a3a" duration={1.5}>
        <App />
      </SkeletonTheme>
    </Provider>
  </Router>,
  // </React.StrictMode>,
);
