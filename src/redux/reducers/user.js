import {
    LOGIN_FAILED,
    LOGIN_REQUESTED,
    LOGIN_SUCCESS,
    LOGOUT_REQUESTED,
    LOGOUT_SUCCESS,
    USER_INFO_REQUEST_ERROR,
    USER_INFO_REQUEST_SUCCESS,
    USER_INFO_REQUESTED
} from '../actionTypes'
import store from '../store'
import {
    loginRequestError,
    loginRequestSuccess,
    logoutRequestSuccess,
    userInfoRequested,
    userInfoRequestError,
    userInfoRequestSuccess
} from '../actions'

const API_URL = `${ process.env.REACT_APP_API_URL }/api`

const initialState = {
    user: null,
    userRequesting: false,
    userRequestError: false,

    loggingIn: false,
    loginSuccess: false,
    loginFailed: false,

    loggingOut: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_INFO_REQUESTED:
            fetch(`${ API_URL }/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
            }).then(resp => {
                resp.json().then(json => {
                    store.dispatch(userInfoRequestSuccess(json.user))
                })
            }).catch(e => {
                store.dispatch(userInfoRequestError())
            })

            return {
                ...state,
                userRequesting: true
            }

        case USER_INFO_REQUEST_SUCCESS:
            return {
                ...state,
                userRequesting: false,
                userRequestError: false,
                user: action.user
            }

        case USER_INFO_REQUEST_ERROR:
            return {
                ...state,
                userRequesting: false,
                userRequestError: true
            }

        case LOGIN_REQUESTED:
            fetch(`${ API_URL }/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
                body: JSON.stringify({ email: action.email, password: action.password })
            }).then(resp => {
                if (resp.status === 200) {
                    store.dispatch(loginRequestSuccess())
                    store.dispatch(userInfoRequested(action.token))
                } else {
                    store.dispatch(loginRequestError())
                }
            }).catch(e => {
                store.dispatch(loginRequestError())
            })

            return {
                ...state,
                loginFailed: false,
                loginSuccess: true,
                loggingIn: true
            }

        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                loginFailed: false,
                loginSuccess: true
            }

        case LOGIN_FAILED:
            return {
                ...state,
                loggingIn: false,
                loginSuccess: false,
                loginFailed: true
            }

        case LOGOUT_REQUESTED:
            fetch(`${ API_URL }/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
            }).then(resp => {
                store.dispatch(logoutRequestSuccess())
            })

            return {
                ...store,
                loggingOut: true
            }

        case LOGOUT_SUCCESS:
            return {
                ...store,
                loggingOut: false,
                user: null
            }

        default:
            return state
    }
}
