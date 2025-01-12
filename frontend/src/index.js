import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Route,BrowserRouter} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
import Login from './Components/Login.js'
import Register from './Components/Register.js'

import Main from './Components/Main.js'

function Router(){
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Route exact path="/" component={Login}/>
        <Route exact path="/register/" component={Register}/>
        <Route exact path="/main/" component={Main}/>
      </BrowserRouter>
    </CookiesProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
