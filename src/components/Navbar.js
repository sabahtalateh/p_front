import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faPizzaSlice, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { dishesInCartRequested, loginRequested, logoutRequested, userInfoRequested } from '../redux/actions'
import LoginModal from './LoginModal'

class Navbar extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            showLogin: false
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.loggingIn === false && nextProps.loginSuccess === true && this.state.showLogin === true) {
            this.setState({
                showLogin: false
            })
        }
    }

    showLogin = () => {
        this.setState({
            showLogin: true
        })
    }

    hideLogin = () => {
        this.setState({
            showLogin: false
        })
    }

    login = (email, password) => {
        this.props.login(this.props.token, email, password)
    }

    logout = () => {
        this.props.logout(this.props.token)
    }

    componentDidMount() {
        this.props.requestDishesInCart(this.props.token)
        this.props.requestUserInfo(this.props.token)
    }

    render() {
        const dishesInCartLoading = this.props.dishesInCartRequesting &&
            <div style={ { marginTop: '4px' } } className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>

        const dishesInCartBadge = this.props.dishesInCart > 0 && <span style={ {
            marginTop: '0.25em',
            marginLeft: '.5em',
            verticalAlign: 'top'
        } } className="badge badge-primary">{ this.props.dishesInCart }</span>

        const cartLink = !this.props.dishesInCartRequesting &&
            <Link className="nav-link" to="/cart"><FontAwesomeIcon icon={ faShoppingCart }/>
                { dishesInCartBadge }
            </Link>

        let authBlock
        if (this.props.userLoading) {
            authBlock = <div style={ { marginTop: '4px' } } className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        } else {
            authBlock = this.props.user === null || this.props.user === undefined
                ? <a className="nav-link" href="#" onClick={ this.showLogin }>Login</a>
                : <a onClick={ this.logout } className="nav-link" href="#">{ this.props.user.email } (Logout) &nbsp;<FontAwesomeIcon icon={ faSignOutAlt }/></a>
        }

        const ordersHistoryBlock = this.props.user && <li>
            <Link className="nav-link" to="/history"><FontAwesomeIcon icon={ faHistory }/>
                &nbsp;History
            </Link>
        </li>

        return (<nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" to="/"><FontAwesomeIcon icon={ faPizzaSlice }/>&nbsp;Pizzza</Link>
            <ul className="nav">
                { ordersHistoryBlock }
                <li className="nav-item">
                    { authBlock }
                </li>
                <li className="nav-item">
                    { dishesInCartLoading }
                    { cartLink }
                </li>
            </ul>
            <LoginModal
                show={ this.state.showLogin }
                onHide={ this.hideLogin }
                onLoginAction={ this.login }
                loggingIn={ this.props.loggingIn }
                loginFailed={ this.props.loginFailed }
            />
        </nav>)
    }
}

const mapStateToProps = ({ cart, auth, user }) => {
    return {
        token: auth.token,
        dishesInCartRequesting: cart.dishesInCartRequesting,
        dishesInCart: cart.dishesInCart,
        user: user.user,
        userLoading: user.userRequesting,
        loggingIn: user.loggingIn,
        loginSuccess: user.loginSuccess,
        loginFailed: user.loginFailed
    }
}

export default connect(
    mapStateToProps,
    {
        requestDishesInCart: dishesInCartRequested,
        requestUserInfo: userInfoRequested,
        login: loginRequested,
        logout: logoutRequested
    }
)(Navbar)
