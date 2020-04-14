import {
    ADD_TO_CART_FAILED,
    ADD_TO_CART_REQUESTED,
    ADD_TO_CART_SUCCEED,
    CART_FAILED_TO_LOAD,
    CART_LOADED,
    CART_REQUESTED,
    CHANGE_AMOUNT_FAILED,
    CHANGE_AMOUNT_REQUESTED,
    CHANGE_AMOUNT_SUCCESS,
    DISHES_IN_CART_FAILED_TO_RECEIVE,
    DISHES_IN_CART_RECEIVED,
    DISHES_IN_CART_REQUESTED,
    ORDER_REQUEST_ERROR,
    ORDER_REQUEST_SUCCESS,
    ORDER_REQUESTED,
    REMOVE_FROM_CART_FAILED,
    REMOVE_FROM_CART_REQUESTED,
    REMOVE_FROM_CART_SUCCESS
} from '../actionTypes'
import store from '../store'
import {
    addToCartFailed,
    addToCartSucceeded,
    cartFailedToLoad,
    cartLoaded,
    changeAmountFailed,
    changeAmountSucceeded,
    dishesInCartFailedToReceive,
    dishesInCartReceived,
    orderFailed,
    orderSucceeded,
    removeFromCartFailed,
    removeFromCartSucceeded
} from '../actions'

const API_URL = `${ process.env.REACT_APP_API_URL }/api`

const initialState = {
    cart: null,
    cartLoading: false,
    cartFailedToLoad: false,

    cartRecordsRemoving: [],
    cartRecordsFailedToRemove: false,

    cartRecordsAmountChanging: [],
    cartRecordsFailedToChangeAmount: false,

    dishesAdding: [],
    dishAddingFailed: false,

    dishesInCartRequesting: true,
    dishesInCartRequestFailed: false,
    dishesInCart: 0,

    orderRequested: false,
    orderRequestError: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CART_REQUESTED:
            fetch(`${ API_URL }/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(cartLoaded(json))
                })
            }).catch(e => {
                store.dispatch(cartFailedToLoad())
            })

            return {
                ...state,
                cartLoadingFailed: false,
                cartLoading: true
            }

        case CART_LOADED:
            return {
                ...state,
                cartLoadingFailed: false,
                cartLoading: false,
                cart: action.cart
            }

        case CART_FAILED_TO_LOAD:
            return {
                ...state,
                cartLoading: false,
                cartLoadingFailed: true
            }

        case DISHES_IN_CART_REQUESTED:
            fetch(`${ API_URL }/dishes-in-cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(dishesInCartReceived(json.dishesInCart))
                })
            }).catch(e => {
                store.dispatch(dishesInCartFailedToReceive())
            })

            return {
                ...state,
                dishesInCartRequestFailed: false,
                dishesInCartRequesting: true
            }

        case DISHES_IN_CART_RECEIVED:
            return {
                ...state,
                dishesInCartRequesting: false,
                dishesInCartRequestFailed: false,
                dishesInCart: action.dishes
            }

        case DISHES_IN_CART_FAILED_TO_RECEIVE:
            return {
                ...state,
                dishesInCartRequesting: false,
                dishesInCartRequestFailed: true,
            }

        case ADD_TO_CART_REQUESTED:
            fetch(`${ API_URL }/to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
                body: JSON.stringify({ dishId: action.dishId })
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(addToCartSucceeded(action.dishId, json.dishesInCart))
                })
            }).catch(e => {
                store.dispatch(addToCartFailed())
            })

            return {
                ...state,
                dishesAdding: [ ...state.dishesAdding, action.dishId ]
            }

        case ADD_TO_CART_SUCCEED:
            return {
                ...state,
                dishesAdding: state.dishesAdding.filter(d => d !== action.dishId),
                dishAddingFailed: false,
                dishesInCart: action.dishesInCart
            }

        case ADD_TO_CART_FAILED:
            return {
                ...state,
                dishAddingFailed: true
            }

        case REMOVE_FROM_CART_REQUESTED:
            fetch(`${ API_URL }/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
                body: JSON.stringify({ recordId: action.id })
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(removeFromCartSucceeded(action.id, json))
                })
            }).catch(e => {
                store.dispatch(removeFromCartFailed(action.id))
            })

            return {
                ...state,
                cartRecordsRemoving: [ ...state.cartRecordsRemoving, action.id ]
            }

        case REMOVE_FROM_CART_SUCCESS:
            return {
                ...state,
                cart: action.cart,
                cartRecordsRemoving: state.cartRecordsRemoving.filter(r => r !== action.id),
                cartRecordsFailedToRemove: false,
                dishesInCart: action.cart.dishesCount
            }

        case REMOVE_FROM_CART_FAILED:
            return {
                ...state,
                cartRecordsFailedToRemove: true
            }

        case CHANGE_AMOUNT_REQUESTED:
            fetch(`${ API_URL }/cart/change-amount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
                body: JSON.stringify({ recordId: action.id, direction: action.direction })
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(changeAmountSucceeded(action.id, json))
                })
            }).catch(e => {
                store.dispatch(changeAmountFailed(action.id))
            })

            return {
                ...state,
                cartRecordsAmountChanging: [ ...state.cartRecordsAmountChanging, action.id ]
            }

        case CHANGE_AMOUNT_SUCCESS:
            return {
                ...state,
                cart: action.cart,
                cartRecordsAmountChanging: state.cartRecordsAmountChanging.filter(r => r !== action.id),
                cartRecordsFailedToChangeAmount: false,
                dishesInCart: action.cart.dishesCount
            }

        case CHANGE_AMOUNT_FAILED:
            return {
                ...state,
                cartRecordsFailedToChangeAmount: true
            }

        case ORDER_REQUESTED:
            fetch(`${ API_URL }/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
                body: JSON.stringify({ phone: action.phone, address: action.address })
            }).then(resp => {
                resp.json().then(cart => {
                    store.dispatch(orderSucceeded(cart))
                })
            }).catch(e => {
                store.dispatch(orderFailed())
            })

            return {
                ...state,
                orderRequested: true
            }

        case ORDER_REQUEST_SUCCESS:
            return {
                ...state,
                orderRequestError: false,
                orderRequested: false,
                cart: action.cart,
                dishesInCart: action.cart.dishesCount
            }

        case ORDER_REQUEST_ERROR:
            return {
                ...state,
                orderRequested: false,
                orderRequestError: true,
            }

        default:
            return state
    }
}
