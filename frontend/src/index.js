import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Route,BrowserRouter} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
import Login from './Components/Login.js'
import Register from './Components/Register.js'

import FileUp from './Components/FileUp.js';
import Recent from './Components/Recent.js';
import FilePage from './Components/FilePage.js';
import Bin from './Components/Bin.js';
import Saved from './Components/Saved.js';

function Router(){
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Route exact path="/" component={Login}/>
        <Route exact path="/register/" component={Register}/>
        <Route exact path="/main/" component={FileUp}/>
        <Route exact path="/recent/" component={Recent} />
        <Route exact path="/file/:id" component={FilePage} />
        <Route exact path="/bin/" component={Bin} />
        <Route exact path="/saved/" component={Saved} />
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
