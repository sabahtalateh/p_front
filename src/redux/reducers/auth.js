import { TOKEN_REQUEST_ERROR, TOKEN_REQUEST_SUCCESS, TOKEN_REQUESTED } from '../actionTypes'
import store from '../store'
import { tokenRequestError, tokenRequestSuccess } from '../actions'

const API_URL = `${ process.env.REACT_APP_API_URL }/api`

const initialState = {
    requested: false,
    requestError: false,
    token: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case TOKEN_REQUESTED:
            const token = window.localStorage.getItem('token')
            if (null !== token) {
                setTimeout(function () {
                    store.dispatch(tokenRequestSuccess(token))
                }, 0)
            } else {
                fetch(`${ API_URL }/token`).then(resp => {
                    resp.json().then(json => {
                        window.localStorage.setItem('token', json.token)
                        store.dispatch(tokenRequestSuccess(json.token))
                    })
                }).catch(_ => {
                    store.dispatch(tokenRequestError())
                })
            }
            return state
        case TOKEN_REQUEST_SUCCESS:
            return {
                ...state,
                requestError: false,
                requested: false,
                token: action.token
            }
        case TOKEN_REQUEST_ERROR:
            return {
                ...state,
                requested: true,
                requestError: true
            }
        default:
            return state
    }
}
