import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Redux Provider
import store from './store'; // Redux store
import { ThemeProvider } from './theme/themeContext'; // Import the ThemeProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap with Redux Provider */}
      <ThemeProvider> {/* Wrap with ThemeProvider */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
