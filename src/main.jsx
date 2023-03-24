import React from 'react';
import ReactDOM from 'react-dom/client';
import TimeContextProvider from './context/TimeContext/TimeContextProvider';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TimeContextProvider>
      <App />
    </TimeContextProvider>
  </React.StrictMode>
);
