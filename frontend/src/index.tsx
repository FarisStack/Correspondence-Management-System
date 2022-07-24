import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
// ---------------- React Router Dom -------------------
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// ====== React Redux Store Provider: ===============
import { Provider } from "react-redux";
// ========== Redux Store where we store all our global states: ====
import { store } from "./store";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


/*
  Now every component that is inside the <App /> will have access to 
  the states of the store
*/