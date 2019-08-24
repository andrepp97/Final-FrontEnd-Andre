import React, { Component } from 'react'
import '../Login/Login.css'
import { Link } from "react-router-dom";
import { userLogin } from '../../redux/1.actions';
import { connect } from "react-redux"
import swal from 'sweetalert';

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
            passError = 'Please provide a password'
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
        if (isValid) {
            this.props.userLogin(this.state.name)
            this.setState({
                nameError : '',
                passError : '',
                name : '',
                pass : ''
            })
            swal("Login Success!", "", "success");
        }
    }

    onLogin = () => {
        this.validateInput()
        this.submitValid()
    }


    render() {
        return (
            <div className='container mt-5'>
                <div className='form-group p-5'>
                    <h1 className='text-center mb-5'>LOG IN</h1>
                    <div className="col-sm-8 offset-sm-2">
                        <div className="txtb">
                            <input type="text" id='username' value={this.state.name} ref='username' onChange={() => this.setState({ name : this.refs.username.value })} required />
                            <label htmlFor="username">Username</label>
                        </div>
                        <p>{this.state.nameError}</p>

                        <div className="txtb">
                            <input type="password" id='password' value={this.state.pass} ref='password' onChange={() => this.setState({ pass : this.refs.password.value })} required />
                            <label htmlFor="password">Password</label>
                        </div>
                        <p>{this.state.passError}</p>

                        <input type="button" className="btnLogin" Value="Login" onClick={this.onLogin} />
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
        namaUser: state.user.username,
        roleUser: state.user.role
    }
}

export default connect(mapStateToProps, {userLogin})(Login)