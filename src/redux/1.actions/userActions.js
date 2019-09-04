import Axios from "axios";
import {urlApi} from "../../2.helpers/database";
import swal from 'sweetalert';


export const userLogin = (userObject) => {
    return(dispatch) => {
        dispatch({
            type: 'IS_LOADING'
        })

        Axios.get(urlApi + 'users', {
            params : {
                username : userObject.username,
                password : userObject.password
            }
        })
        .then((res) => {
            if (res.data.length > 0) {
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : {
                        username: res.data[0].username,
                        role : res.data[0].role,
                        id : res.data[0].id
                    }
                })
            }else{
                dispatch({
                    type: 'NOT_LOADING'
                })
                swal('Login Failed!', "Wrong username or password", "warning")
            }
        })
        .catch((err) => {
            dispatch({
                type: 'NOT_LOADING'
            })
            swal('System Error!', "Unable to connect to server, try again later.", "error")
        })
    }
}


export const userRegister = (regisObject) => {
    return(dispatch) => {
        dispatch({
            type: 'IS_LOADING'
        })

        // GET the duplicate username
        Axios.get(urlApi + 'users', {
            params: {
                username: regisObject.username
            }
        })
        .then((res) => {
            if (res.data.length > 0) {
                dispatch({
                    type : 'NOT_LOADING'
                })
                swal('Register Failed!', 'Username already taken', 'warning')
            }else{
                Axios.post(urlApi + 'users', regisObject)
                    .then((res) => {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload : {
                                username: res.data.username,
                                password : res.data.passwword,
                                role : res.data.role,
                                id : res.data.id
                            }
                        })
                        var contentBro = document.createElement('div');
                        contentBro.innerHTML = 'You can now login as <strong>' + res.data.username + '<strong>'
                        swal({
                            title: 'Register Success!',
                            content: contentBro,
                            icon: "success"
                        })
                    })
                    .catch((err) => {
                        dispatch({
                            type: 'NOT_LOADING'
                        })
                        swal('System Error!', "Unable to connect to server, try again later.", "error")
                    })
            }
        })
        .catch((err) => {
            dispatch({
                type: 'NOT_LOADING'
            })
            swal('System Error!', "Unable to connect to server, try again later.", "error")
        })
    }
}


export const keepLogin = (cookieData) => {
    return (dispatch) => {
        Axios.get(urlApi + 'users', {
            params : {
                username : cookieData
            }
        })
        .then((res) => {
            dispatch({
                type : 'KEEP_LOGIN',
                payload : {
                    username : res.data[0].username,
                    role : res.data[0].role,
                    id : res.data[0].id
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: 'NOT_LOADING'
            })
            swal('System Error!', "Unable to connect to server, try again later.", "error")
        })
    }
}

    
export const userLogout = () => {
    return (dispatch) => {
        dispatch({
            type: 'LOGOUT'
        })
    }
}


export const cookieChecker = () => {
    return (dispatch) => {
        dispatch({
            type: 'COOKIE_CHECK'
        })
    }
}


export const getCartQty = (idUser) => {
    return (dispatch) => {
        if (idUser !== '') {
        Axios.get(urlApi + 'Cart?userId=' + idUser)
            .then(res => {
                dispatch({
                    type: 'GET_CART',
                    carts: res.data.length
                })
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}