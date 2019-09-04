import React, { Component } from 'react'
import '../Login/Login.css'
import { Link } from "react-router-dom";
import { userLogin } from '../../redux/1.actions';
import { connect } from "react-redux"
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'
import {getCartQty} from '../../redux/1.actions'


let cookieObj = new Cookie()

class Login extends Component {
    state = {
        name : '',
        pass : '',
        nameError : ``,
        passError : ''
    }

    validateInput = () => {
        let nameError = ``
        let passError = ''

        if (this.state.name === '') {
            nameError = `Username can't be empty`
        }

        if (this.state.pass === '') {
            passError = 'Please fill the password'
        }

        if (nameError || passError) {
            this.setState({
                nameError,
                passError
            })
            return false
        }

        return true
    }

    submitValid = () => {
        const isValid = this.validateInput()
        let loginObject = {
            username: this.state.name,
            password: this.state.pass
        }

        // Jika input nya valid maka melakukan Login
        if (isValid) {
            this.props.userLogin(loginObject)

            // Clear Form Input
            this.setState({
                nameError : '',
                passError : '',
                name : '',
                pass : ''
            })
        }
    }

    onLogin = () => {
        this.validateInput()
        this.submitValid()
    }

    onEnter = (event) => {
        if (event.key === 'Enter') {
            this.onLogin()
        }
    }

    componentWillReceiveProps(newProps){
        cookieObj.set('userData', newProps.userObj.username, {path : '/'})
        // cookieObj.set('userData', newProps.userObj.id, { path: '/' })
    }


    render() {
        if (this.props.userObj.username !== '') {
            return <Redirect to='/'></Redirect>
        }

        return (
            <div className='container mt-5'>
                <div className="row mt-5">&nbsp;</div>
                <div className='card col-md-6 offset-md-3 py-4 mt-5'>
                    <h1 className='text-center mb-5'>LOG IN</h1>
                    <div className="col-md-10 offset-md-1">
                        <div className="txtb">
                            <input type="text" id='username' value={this.state.name} onChange={(e) => this.setState({ name : e.target.value })} required />
                            <label htmlFor="username">Username</label>
                        </div>
                        <p>{this.state.nameError}</p>

                        <div className="txtb">
                            <input type="password" id='password' value={this.state.pass} onKeyUp={this.onEnter} onChange={(e) => this.setState({ pass: e.target.value })} required />
                            <label htmlFor="password">Password</label>
                        </div>
                        <p>{this.state.passError}</p>

                        <div className='text-center'>
                            {
                                !this.props.userObj.loading
                                ?
                                <input type="button" className="btnLogin" value="Login" onClick={this.onLogin} />
                                :
                                <div class="spinner-border text-primary" role="status"></div>
                            }
                        </div>
                    </div>
                    <div className="bottom-text">
                        Don't have account ? &nbsp;<Link to='/Register' className='text-primary'>Register</Link>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userObj: state.user        
    }
}

export default connect(mapStateToProps, { userLogin, getCartQty})(Login)