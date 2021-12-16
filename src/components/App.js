import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
import ModifyProductPage from './views/UploadProductPage/ModifyProductPage'
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import CartPage from './views/CartPage/CartPage';
import Axios from 'axios';

function App() {
  Axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  let token = window.localStorage.getItem('auth');
  if(token) Axios.defaults.headers.common['Authorization'] = "Bearer " + token;

  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/product/modify/:productId" component={Auth(ModifyProductPage, null)} />
          <Route exact path="/cart" component={Auth(CartPage, true)} />

        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
