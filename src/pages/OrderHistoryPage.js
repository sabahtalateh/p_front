import React from 'react'
import { connect } from 'react-redux'
import { historyRequested } from '../redux/actions'
import { Redirect } from 'react-router-dom'

class OrderHistoryPage extends React.Component {
    componentDidMount() {
        this.props.requestHistory(this.props.token)
    }

    render() {
        if (this.props.user === null) {
            return <Redirect to="/"/>
        }

        const failed = this.props.historyRequestError && <div className="alert alert-danger" role="alert">
            Error! Dishes list can not be loaded
        </div>

        const spinner = this.props.historyLoading && <div className="text-center" style={ { marginTop: '16px' } }>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

        let content = null

        if (!this.props.historyLoading && !this.props.historyRequestError && this.props.history !== null) {
            let tableRows
            if (this.props.history.length === 0) {
                tableRows = <tr>
                    <td>No records (order something)</td>
                </tr>
            } else {
                tableRows = this.props.history.map(r => {
                    return <tr key={ r.id }>
                        <td><b>$ { r.total_cost }</b> ({ r.total_amount } dishes)</td>
                        <td>
                            <table>
                                <tbody>
                                { r.dishes.map((d, idx) => <tr key={ idx }>
                                    <td>{ d.dish.name }</td>
                                    <td><small>{ d.amount } * $ { d.dish.cost } = </small><b>$ { d.cost }</b></td>
                                </tr>) }
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table>
                                <tbody>
                                <tr>
                                    <td>Phone: { r.order.phone }</td>
                                </tr>
                                <tr>
                                    <td>Address: { r.order.address }</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                })
            }

            content = <table className="table">
                <tbody>
                { tableRows }
                </tbody>
            </table>
        }

        return (
            <>
                { failed }
                { spinner }
                { content }
            </>
        )
    }
}

const mapStateToProps = ({ auth, history, user }) => {
    return {
        token: auth.token,
        history: history.history,
        historyLoading: history.historyLoading,
        historyRequestError: history.historyRequestError,
        user: user.user
    }
}

export default connect(
    mapStateToProps,
    { requestHistory: historyRequested }
)(OrderHistoryPage)
