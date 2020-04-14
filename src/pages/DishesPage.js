import React from 'react'
import { connect } from 'react-redux'
import { addToCartRequested, dishesRequested } from '../redux/actions'

class DishesPage extends React.Component {
    componentDidMount() {
        if (0 === this.props.dishes.length) {
            this.props.requestDishes()
        }
    }

    addToCart = (dishId) => {
        this.props.addToCart(dishId, this.props.token)
    }

    render() {
        const failed = this.props.failedToLoad && <div className="alert alert-danger" role="alert">
            Error! Dishes list can not be loaded
        </div>

        const spinner = this.props.loading && <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

        const dishes = this.props.dishes.length > 0 && this.props.dishes.map(d => {
            let addButton
            if (this.props.dishesAdding.includes(d.id)) {
                addButton = <button style={ { width: '100%' } } className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    <span className="sr-only">Loading...</span>
                </button>
            } else {
                addButton =
                    <button style={ { width: '100%' } } onClick={ () => this.addToCart(d.id) }
                            className="btn btn-primary">Add to cart</button>
            }

            return (<div key={ d.id } className="card">
                <img className="card-img-top" src={ d.image } alt={ d.name }/>
                <div className="card-body">
                    <h5 className="card-title">{ d.name }</h5>
                    <p className="card-text">{ d.description }</p>
                    <b>$ { d.cost }</b>
                    <div className="text-right" style={ { marginTop: '16px' } }>
                        { addButton }
                    </div>
                </div>
            </div>)
        })

        const wrapperClass = this.props.dishes.length > 0 ? 'card-columns' : ''
        return (
            <div className={ wrapperClass } style={ {
                marginTop: '16px'
            } }>
                { spinner }
                { failed }
                { dishes }
            </div>
        )
    }
}

const mapStateToProps = ({ dishes, cart, auth }) => {
    return {
        token: auth.token,
        loading: dishes.loading,
        failedToLoad: dishes.failedToLoad,
        dishes: dishes.dishes,
        paging: dishes.paging,
        dishesAdding: cart.dishesAdding,
        dishAddingFailed: cart.dishAddingFailed
    }
}

export default connect(
    mapStateToProps,
    {
        requestDishes: dishesRequested,
        addToCart: addToCartRequested
    }
)(DishesPage)
