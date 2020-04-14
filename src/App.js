import React from 'react'
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom'

import DishesPage from './pages/DishesPage'
import CartPage from './pages/CartPage'
import { connect } from 'react-redux'
import { tokenRequested } from './redux/actions'
import Navbar from './components/Navbar'
import OrderHistoryPage from './pages/OrderHistoryPage'

class App extends React.Component {
    componentDidMount() {
        this.props.requestToken()
    }

    render() {
        const tokenError = this.props.tokenRequestError && <div className="alert alert-danger" role="alert">
            Error while trying to request token
        </div>

        const tokenRequestingSpinner = this.props.tokenRequesting && <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

        const appContent = this.props.token && <Router>
            <div>
                <Navbar/>
                <Switch>
                    <Route path="/history">
                        <OrderHistoryPage/>
                    </Route>
                    <Route path="/cart">
                        <CartPage/>
                    </Route>
                    <Route path="/">
                        <DishesPage/>
                    </Route>
                </Switch>
            </div>
        </Router>

        return (
            <>
                { tokenRequestingSpinner }
                { tokenError }
                { appContent }
            </>
        )
    }
}

const mapStateToProps = ({ auth: state }) => {
    return {
        token: state.token,
        tokenRequesting: state.requested,
        tokenRequestError: state.requestError,
    }
}

export default connect(
    mapStateToProps,
    { requestToken: tokenRequested }
)(App)
