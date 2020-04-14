import { combineReducers } from 'redux'
import dishes from './dishes'
import auth from './auth'
import cart from './cart'
import user from './user'
import history from './history'

export default combineReducers({ auth, dishes, cart, user, history })
