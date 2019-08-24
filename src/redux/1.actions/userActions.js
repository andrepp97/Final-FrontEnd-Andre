export const userLogin = (param) => {
    return {
        type: 'LOGIN',
        payload: param
    }
}

export const userLogout = (param2) => {
    return {
        type: 'LOGOUT',
        payload: param2
    }
}