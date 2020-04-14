import { DISHES_FAILED_TO_LOAD, DISHES_LOADED, DISHES_REQUESTED } from '../actionTypes'
import { dishesFailedToLoad, dishesLoaded } from '../actions'
import store from '../store'

const API_URL = `${ process.env.REACT_APP_API_URL }/api`

const initialState = {
    loading: false,
    failedToLoad: false,
    dishes: [],
    paging: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case DISHES_REQUESTED:
            fetch(`${ API_URL }/dishes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-TOKEN': action.token
                }
            }).then(resp => {
                resp.json().then(dishes => {
                    store.dispatch(dishesLoaded(dishes))
                })
            }).catch(e => {
                store.dispatch(dishesFailedToLoad())
            })
            return {
                ...state,
                loading: true,
                failedToLoad: false
            }
        case DISHES_LOADED:
            return {
                ...state,
                loading: false,
                failedToLoad: false,
                dishes: action.dishes || []
            }
        case DISHES_FAILED_TO_LOAD:
            return {
                ...state,
                loading: false,
                failedToLoad: true
            }
        default:
            return state
    }
}
