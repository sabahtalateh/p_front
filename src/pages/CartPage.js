import React from 'react'
import { connect } from 'react-redux'
import { cartRequested, changeAmountRequested, orderRequested, removeFromCartRequested } from '../redux/actions'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CartPage extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            phone: '',
            address: '',
            error: null
        }
    }

    componentDidMount() {
        this.props.requestCart(this.props.token)
    }

    removeOrderRecord = (id) => {
        this.props.removeRecord(this.props.token, id)
    }

    increase = (id) => {
        this.props.changeAmount(this.props.token, id, 'inc')
    }

    decrease = (id) => {
        this.props.changeAmount(this.props.token, id, 'dec')
    }

    order = () => {
        if ('' === this.state.phone || '' === this.state.address) {
            this.setState({
                error: 'Please fill both above fields'
            })
            return
        }

        this.props.order(this.props.token, this.state.phone, this.state.address)
    }

    changePhone = (event) => {
        this.setState({ phone: event.target.value })
    }

    changeAddress = (event) => {
        this.setState({ address: event.target.value })
    }

    render() {
        const failed = this.props.cartFailedToLoad && <div className="alert alert-danger" role="alert">
            Error! Dishes list can not be loaded
        </div>

        const spinner = this.props.cartLoading && <div className="text-center" style={ { marginTop: '16px' } }>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

        const cartBody = !this.props.cartLoading
            && !this.props.cartFailedToLoad
            && this.props.cart
            && this.props.cart.records.map(el => {
                const removeButton = this.props.cartRecordsRemoving.includes(el.id)
                    ? <button style={ { width: '40px' } } className="btn btn-danger" type="button" disabled>
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    : <button style={ { width: '40px' } } type="button" className="btn btn-danger"
                              onClick={ () => this.removeOrderRecord(el.id) }>
                        <FontAwesomeIcon icon={ faTimes }/>
                    </button>

                const amountBlock = this.props.cartRecordsAmountChanging.includes(el.id)
                    ? <>
                        <button type="button" className="btn btn-primary disabled">-</button>
                        <button className="btn btn-light disabled" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span className="sr-only">Loading...</span>
                        </button>
                        <button type="button" className="btn btn-primary disabled">+</button>
                    </>
                    : <>
                        <button onClick={ () => this.decrease(el.id) } type="button" className="btn btn-primary">-
                        </button>
                        <button type="button" className="btn btn-light disabled"
                                style={ { cursor: 'default', color: 'black', width: '42px' } }>{ el.amount }</button>
                        <button onClick={ () => this.increase(el.id) } type="button" className="btn btn-primary">+
                        </button>
                    </>

                const recordCostTd = el.amount === 1
                    ? <td style={ { textAlign: 'right' } }><b>$ { el.record_cost }</b></td>
                    : <td style={ { textAlign: 'right' } }>
                        <small>$ { el.dish.cost } * { el.amount } = </small><b>$ { el.record_cost }</b></td>

                return <tr key={ el.dish.id }>
                    <td><img width='100px' height='100px' alt={ el.dish.name } src={ el.dish.image }/></td>
                    <td><b>{ el.dish.name }</b></td>
                    { recordCostTd }
                    <td>{ amountBlock }</td>
                    <td>{ removeButton }</td>
                </tr>
            })

        let content = null
        let orderForm = null

        if (!this.props.cartLoading && !this.props.cartFailedToLoad && this.props.cart) {
            if (this.props.cart.records.length > 0) {
                content = <table className="table">
                    <tbody>
                    { cartBody }
                    </tbody>
                    <tfoot style={ { fontWeight: 'bold' } }>
                    <tr>
                        <td colSpan="4">Total</td>
                        <td style={ { width: '100px' } }>$ { this.props.cart.totalCost }</td>
                    </tr>
                    </tfoot>
                </table>

                const orderButton = this.props.orderRequested
                    ? <button className="btn btn-success btn-lg btn-block" type="button" disabled>
                        <span style={ {
                            width: '1.3rem',
                            height: '1.3rem',
                            marginRight: '.3em'
                        } } className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                    </button>
                    : <button className="btn btn-success btn-lg btn-block" type="button" onClick={ this.order }>
                        Order
                    </button>

                const error = this.state.error &&
                    <span style={ {
                        marginBottom: '16px',
                        display: 'block'
                    } } className="help-block alert-danger">{ this.state.error }</span>

                orderForm = <form>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input required type="tel" className="form-control" id="phone" placeholder="+1 (234) 567-8910"
                               value={ this.state.phone } onChange={ this.changePhone }/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Delivery Address</label>
                        <textarea required className="form-control" id="address"
                                  rows="3" onChange={ this.changeAddress } value={ this.state.address }/>
                    </div>
                    { error }
                    { orderButton }
                </form>
            } else {
                content = <h1>Cart is empty</h1>
            }
        }

        return (
            <>
                { failed }
                { spinner }
                { content }
                { orderForm }
            </>
        )
    }
}

const mapStateToProps = ({ auth, cart }) => {
    return {
        token: auth.token,
        cartLoading: cart.cartLoading,
        cartFailedToLoad: cart.cartFailedToLoad,
        cart: cart.cart,
        cartRecordsRemoving: cart.cartRecordsRemoving,
        cartRecordsAmountChanging: cart.cartRecordsAmountChanging,
        orderRequested: cart.orderRequested
    }
}

export default connect(
    mapStateToProps,
    {
        requestCart: cartRequested,
        removeRecord: removeFromCartRequested,
        changeAmount: changeAmountRequested,
        order: orderRequested
    }
)(CartPage)
