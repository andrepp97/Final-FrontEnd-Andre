import React, {Component} from 'react';
import { withRouter, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './1.components/Home/Home';
import Nav from './1.components/Navbar/Navbar'
import Footer from './1.components/Footer/Footer'
import Login from './1.components/Login/Login'
import Regis from './1.components/Register/Register'
import ProductDetails from './1.components/ProductDetails/ProductDetails'
import Cart from './1.components/Cart/Cart'
import History from './1.components/History/History'
import AdminPage from './1.components/Admin/AdminPage'
import Cookie from 'universal-cookie'
import {connect} from 'react-redux'
import {keepLogin, cookieChecker, getCartQty} from './redux/1.actions'


let cookieObj = new Cookie()

class App extends Component {

  componentDidMount() {
    let cookieVar = cookieObj.get('userData')
    if (cookieVar) {
      this.props.keepLogin(cookieVar)
    }else{
      this.props.cookieChecker()
    }
  }
  

  render() {
    if (this.props.globalCookie) {
      return (
        <div>
        <Nav/>
        <Switch>
          <Route component={Home} path='/' exact />
          <Route component={Login} path='/Login' exact />
          <Route component={Regis} path='/Register' exact />
          <Route component={ProductDetails} path='/product-details/:id' exact />
          <Route component={Cart} path='/Cart' exact />
          <Route component={History} path='/history' exact />
          <Route component={AdminPage} path='/adminDashboard' exact />
        </Switch>
        <Footer/>
      </div>
      )
    }
    return (
      <>
        <h3 className='text-center mt-5'>Please Wait . . .</h3>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    globalCookie: state.user.cookie,
    id : state.user.id
  }
}

export default connect(mapStateToProps, { keepLogin, cookieChecker, getCartQty })(withRouter(App))