import { HISTORY_REQUEST_ERROR, HISTORY_REQUEST_SUCCESS, HISTORY_REQUESTED } from '../actionTypes'
import store from '../store'
import { historyRequestFailed, historyRequestSucceeded } from '../actions'

const API_URL = `${ process.env.REACT_APP_API_URL }/api`

const initialState = {
    history: null,
    historyLoading: false,
    historyRequestError: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case HISTORY_REQUESTED:
            fetch(`${ API_URL }/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                },
            }).then(resp => {
                resp.json().then(history => {
                    store.dispatch(historyRequestSucceeded(history))
                })
            }).catch(_ => {
                store.dispatch(historyRequestFailed())
            })
            return {
                ...state,
                historyLoading: true
            }

        case HISTORY_REQUEST_SUCCESS:
            return {
                ...state,
                historyLoading: false,
                historyRequestError: false,
                history: action.history
            }

        case HISTORY_REQUEST_ERROR:
            return {
                ...state,
                historyLoading: false,
                historyRequestError: true
            }

        default:
            return state
    }
}
