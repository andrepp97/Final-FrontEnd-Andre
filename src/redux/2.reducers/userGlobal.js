const INITIAL_STATE = {
    id : 0,
    username : '',
    role : '',
    cookie : false,
    loading : false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...INITIAL_STATE,
                username: action.payload.username,
                id: action.payload.id,
                role: action.payload.role,
                cookie: true
            }
        case 'KEEP_LOGIN':
            return{
                ...INITIAL_STATE,
                username: action.payload.username,
                id: action.payload.id,
                role: action.payload.role,
                cookie: true
            }
        case 'IS_LOADING':
            return {...INITIAL_STATE, loading : true, cookie: true}
        case 'NOT_LOADING':
            return {...INITIAL_STATE, loading : false, cookie: true}
        case 'LOGOUT':
            return {...INITIAL_STATE, cookie: true}
        case 'COOKIE_CHECK':
            return {...state, cookie:true}
        default:
            return state
    }
}