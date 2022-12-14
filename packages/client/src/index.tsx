import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import WebsocketContext from './features/websocketsSystem/websocketContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <WebsocketContext>
          <App />
        </WebsocketContext>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
