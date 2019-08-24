import React, { Component } from 'react'
import { Link } from "react-router-dom";
import swal from 'sweetalert'

export default class Register extends Component {
    state = {
        name: '',
        pass: '',
        nameError: ``,
        passError: ''
    }

    validateInput = () => {
        let nameError = ``
        let passError = ''

        if (this.state.name === '') {
            nameError = `Username can't be empty`
        }else{
            nameError = ''
            this.setState({nameError})
        }

        if (this.state.pass === '') {
            passError = 'Please provide a password'
        } else {
            passError = ''
            this.setState({ passError })
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
            this.setState({
                nameError: '',
                passError: '',
                name: '',
                pass: ''
            })
            swal("Register Success!", "", "success");
        }
    }

    onRegister = () => {
        this.validateInput()
        this.submitValid()
    }


    render() {
        return (
                <div className='container mt-5'>
                    <div className='form-group p-5'>
                        <h1 className='text-center mb-5'>REGISTER</h1>
                        <div className="col-sm-8 offset-sm-2">
                            <div className="txtb">
                                <input type="text" id='username' value={this.state.name} ref='username' onChange={() => this.setState({ name: this.refs.username.value })} required />
                                <label htmlFor="username">Username</label>
                            </div>
                            <p>{this.state.nameError}</p>

                            <div className="txtb">
                                <input type="password" id='password' value={this.state.pass} ref='password' onChange={() => this.setState({ pass: this.refs.password.value })} required />
                                <label htmlFor="password">Password</label>
                            </div>
                            <p>{this.state.passError}</p>

                            <input type="button" className="btnRegis" Value="Register" onClick={this.onRegister} />
                        </div>
                        <div className="bottom-text">
                        Already have an account ? &nbsp;<Link to='/Login' className='text-primary'>Login</Link>
                        </div>
                    </div>
                </div>
        )
    }
}
