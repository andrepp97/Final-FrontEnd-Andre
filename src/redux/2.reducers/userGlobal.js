const INITIAL_STATE = {
    id : 0,
    username : '',
    role : 'user',
    cookie : false,
    loading : false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {...INITIAL_STATE, username : action.payload}
        case 'LOGOUT':
            return {...INITIAL_STATE, username : action.payload}
        default:
            return state
    }
}