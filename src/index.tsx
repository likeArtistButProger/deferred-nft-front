import React from 'react';
import ReactDOM from 'react-dom/client';
import {ethers} from "ethers";
import { Web3ReactProvider } from '@web3-react/core';
import { ThemeProvider } from 'styled-components';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { Colors } from './styles';

const getLibrary = (connector: any) => {
  const library = new ethers.providers.Web3Provider(connector);
  library.pollingInterval = 15000;

  return library;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = {
  colors: Colors
}

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
