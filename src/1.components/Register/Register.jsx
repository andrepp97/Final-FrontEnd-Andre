import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux"
import { userRegister } from '../../redux/1.actions';
import Show from "../../img/show_password.png";
import Hide from "../../img/hide_password.png";
import { Redirect } from 'react-router-dom'
import Cookie from 'universal-cookie'
let cookieObj = new Cookie()


class Register extends Component {
    state = {
        name: '',
        pass: '',
        pass2: '',
        nameError: ``,
        passError: '',
        pass2Error: '',
        show : true
    }

    componentWillReceiveProps(newProps) {
        cookieObj.set('userData', newProps.userObj.username, { path: '/' })
    }

    validateInput = () => {
        let nameError = ``
        let passError = ''
        let pass2Error = ''

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

        if (this.state.pass2 !== this.state.pass) {
            this.setState({
                pass2Error : 'Passwords are not the same'
            })
            return false
        }

        if (nameError || passError || pass2Error) {
            this.setState({
                nameError,
                passError,
                pass2Error
            })
            return false
        } 

        return true
    }

    submitValid = () => {
        let regisObject = {
            username: this.state.name,
            password: this.state.pass,
            role: 'user'
        }
        
        // Jika input nya valid maka melakukan Register
        const isValid = this.validateInput()
        if (isValid) {
            this.props.userRegister(regisObject)
        }
    }

    onRegister = () => {
        this.validateInput()
        this.submitValid()
    }

    showPassword = () => {
        this.setState({ show: !this.state.show })

        if (this.state.show) {
            this.refs.inputan.type = 'text'
            this.refs.password.type = 'text'
        }else{
            this.refs.inputan.type = 'password'
            this.refs.password.type = 'password'
        }
    }


    render() {
        if (this.props.userObj.username !== '') {
            return <Redirect to='/'></Redirect>
        }

        return (
                <div className='container mt-5'>
                    <div className="row mt-5">&nbsp;</div>
                    <div className='card col-md-6 offset-md-3 py-4 mt-5'>
                        <h1 className='text-center mb-5'>REGISTER</h1>
                        <div className="col-md-10 offset-md-1">
                            <div className="txtb">
                                <input type="text" id='username' value={this.state.name} ref='username' onChange={(e) => this.setState({ name: e.target.value })} required />
                                <label htmlFor="username">Username</label>
                            </div>
                            <p>{this.state.nameError}</p>
                            
                            <div className="txtb">
                                <input type="password" id='password' value={this.state.pass} ref='password' onChange={(e) => this.setState({ pass: e.target.value })} required />
                                <label htmlFor="password">Password</label>
                            </div>
                            <p>{this.state.passError}</p>

                            <div className="input-group">
                                <div className="form-control">
                                    <div className="txtb">
                                        <input type="password" id='password2' value={this.state.pass2} ref='inputan' onChange={() => this.setState({ pass2: this.refs.inputan.value })} required />
                                        <label htmlFor="password2">Repeat Password</label>
                                    </div>
                                </div>
                                <div className="input-group-append">
                                   {
                                    this.state.show === true
                                    ?
                                        <button  type="button" id="button-addon2" onClick={this.showPassword}> <img src={Show} alt='Show Password' /></button>
                                    :
                                        <button  type="button" id="button-addon2" onClick={this.showPassword}> <img src={Hide} alt='Hide Password' /></button>
                                   }
                                </div>
                            </div>
                            <p className='mb-5'>{this.state.pass2Error}</p>
                            
                            <div className='text-center'>
                            {
                                !this.props.userObj.loading
                                ?
                                <input type="button" className="btnRegis" value="Create Account" onClick={this.onRegister} />
                                :
                                <div class="spinner-border text-primary" role="status"></div>
                            }
                            </div>
                        </div>
                        <div className="bottom-text">
                        Already have an account ? &nbsp;<Link to='/Login' className='text-primary'>Login</Link>
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

export default connect(mapStateToProps, { userRegister })(Register)