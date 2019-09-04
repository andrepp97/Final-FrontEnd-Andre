const INITIAL_STATE = { cartLength: 0 }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'GET_CART':
            return {
                ...state,
                cartLength : action.carts
            }
        default:
            return state
    }
}