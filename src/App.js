import React from 'react';
import { withRouter, Route, Switch } from "react-router-dom";
import Home from './1.components/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './1.components/Navbar/Navbar'
import Footer from './1.components/Footer/Footer'
import Login from './1.components/Login/Login'
import Regis from './1.components/Register/Register'


function App() {
  return (
    <div style={{background:'whitesmoke'}}>
      <Nav/>
      <Switch>
        <Route component={Home} path='/' exact />
        <Route component={Login} path='/Login' exact />
        <Route component={Regis} path='/Register' exact />
      </Switch>
      <Footer/>
    </div>
  );
}

export default withRouter(App);