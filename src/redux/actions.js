import * as actions from './actionTypes'

export const tokenRequested = () => ({ type: actions.TOKEN_REQUESTED })
export const tokenRequestSuccess = (token) => ({ type: actions.TOKEN_REQUEST_SUCCESS, token })
export const tokenRequestError = () => ({ type: actions.TOKEN_REQUEST_ERROR })

export const loginRequested = (token, email, password) => ({ type: actions.LOGIN_REQUESTED, token, email, password })
export const loginRequestSuccess = () => ({ type: actions.LOGIN_SUCCESS })
export const loginRequestError = () => ({ type: actions.LOGIN_FAILED })

export const logoutRequested = (token) => ({ type: actions.LOGOUT_REQUESTED, token })
export const logoutRequestSuccess = () => ({ type: actions.LOGOUT_SUCCESS })
export const logoutRequestError = () => ({ type: actions.LOGOUT_FAILED })

export const userInfoRequested = (token) => ({ type: actions.USER_INFO_REQUESTED, token })
export const userInfoRequestSuccess = (user) => ({ type: actions.USER_INFO_REQUEST_SUCCESS, user })
export const userInfoRequestError = () => ({ type: actions.USER_INFO_REQUEST_ERROR })

export const dishesRequested = () => ({ type: actions.DISHES_REQUESTED })
export const dishesLoaded = (dishes) => ({ type: actions.DISHES_LOADED, dishes })
export const dishesFailedToLoad = () => ({ type: actions.DISHES_FAILED_TO_LOAD })

export const dishesInCartRequested = (token) => ({ type: actions.DISHES_IN_CART_REQUESTED, token })
export const dishesInCartReceived = (dishes) => ({ type: actions.DISHES_IN_CART_RECEIVED, dishes })
export const dishesInCartFailedToReceive = () => ({ type: actions.DISHES_IN_CART_FAILED_TO_RECEIVE })

export const cartRequested = (token) => ({ type: actions.CART_REQUESTED, token })
export const cartLoaded = (cart) => ({ type: actions.CART_LOADED, cart })
export const cartFailedToLoad = () => ({ type: actions.CART_FAILED_TO_LOAD })

export const removeFromCartRequested = (token, id) => ({ type: actions.REMOVE_FROM_CART_REQUESTED, token, id })
export const removeFromCartSucceeded = (id, cart) => ({ type: actions.REMOVE_FROM_CART_SUCCESS, id, cart })
export const removeFromCartFailed = (id) => ({ type: actions.REMOVE_FROM_CART_FAILED, id })

export const changeAmountRequested = (token, id, direction) => ({
    type: actions.CHANGE_AMOUNT_REQUESTED,
    token,
    id,
    direction
})
export const changeAmountSucceeded = (id, cart) => ({ type: actions.CHANGE_AMOUNT_SUCCESS, id, cart })
export const changeAmountFailed = (id) => ({ type: actions.CHANGE_AMOUNT_FAILED, id })

export const addToCartRequested = (dishId, token) => ({ type: actions.ADD_TO_CART_REQUESTED, dishId, token })
export const addToCartSucceeded = (dishId, dishesInCart) => ({
    type: actions.ADD_TO_CART_SUCCEED,
    dishId,
    dishesInCart
})
export const addToCartFailed = (dishId, token) => ({ type: actions.ADD_TO_CART_FAILED, dishId, token })

export const orderRequested = (token, phone, address) => ({ type: actions.ORDER_REQUESTED, token, phone, address })
export const orderSucceeded = (cart) => ({ type: actions.ORDER_REQUEST_SUCCESS, cart })
export const orderFailed = () => ({ type: actions.ORDER_REQUEST_ERROR })

export const historyRequested = (token) => ({ type: actions.HISTORY_REQUESTED, token })
export const historyRequestSucceeded = (history) => ({ type: actions.HISTORY_REQUEST_SUCCESS, history })
export const historyRequestFailed = () => ({ type: actions.HISTORY_REQUEST_ERROR })
