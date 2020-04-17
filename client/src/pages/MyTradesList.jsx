import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``
const Update = styled.div.attrs({ className: 'text-success' })` cursor: pointer; `

class UpdateRequest extends Component {
  updateUser = async event => {
    event.preventDefault()
    const { _id, } = this.props
    if (window.confirm(`Do tou want to acept the request of the book ${_id} ?`,)) {

      const payload = { take_ok: true }
      await api.updateRequestById(_id, payload)
      .catch(error => {
        console.log(error)
      })

      window.location.href = '/trades'
    }
  }
  render() {
    return <Update onClick={this.updateUser}>Acept Request</Update>
  }
}
class TradesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tradesTrue: [],
            tradesFalse: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })
        const { user_id } = this.state

        await api.getRequestsByTakeOk(true).then(trades => {
          const myTrades = trades.data.data.filter((item, ind) => item.take_book_id.user_id._id === user_id)
          this.setState({
              tradesTrue: myTrades,
          })
        })
        .catch(error => {
          console.log(error)
        })

        await api.getRequestsByTakeOk(false).then(trades => {
          const myTrades = trades.data.data.filter((item, ind) => item.take_book_id.user_id._id === user_id)
          this.setState({
              tradesFalse: myTrades,
              isLoading: false,
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({
              isLoading: false,
          })
        })

    }
    render() {
      console.log('my trades', this.state)
        const { tradesTrue, tradesFalse, isLoading } = this.state
        const trades = [...tradesTrue, ...tradesFalse]
        const columns = [
          {
              Header: 'ID',
              accessor: '_id',
              filterable: true,
          },
          {
              Header: 'The User',
              accessor: '',
              Cell: function(props) {
                  return (
                    <span>
                      <React.Fragment>
                        <Link to={{ pathname: `/user/${props.original.user_id._id}`,
                                state: {
                                  authenticated: this.state.authenticated,
                                  user_id: this.state.user_id,
                                  user: this.state.user,
                                  backURL: '/mytrades',
                                }
                              }}
                              className="nav-link" >{props.original.user_id.screenName}</Link>
                      </React.Fragment>
                    </span>
                  )
              }.bind(this),
          },
          {
              Header: 'Wants to Take',
              accessor: '',
              Cell: function(props) {
                  return (
                    <span>
                      <React.Fragment>
                        <div>
                          {props.original.take_book_id.title}<br />
                          {props.original.take_book_id.author}
                        </div>
                      </React.Fragment>
                    </span>
                  )
              },
          },
          {
              Header: 'from User',
              accessor: '',
              Cell: function(props) {
                  return (
                    <span>
                      <React.Fragment>
                        <Link to={{ pathname: `/user/${props.original.take_book_id.user_id._id}`,
                                state: {
                                  authenticated: this.state.authenticated,
                                  user_id: this.state.user_id,
                                  user: this.state.user,
                                  backURL: '/mytrades',
                                }
                              }}
                              className="nav-link" >{props.original.take_book_id.user_id.screenName}</Link>
                      </React.Fragment>
                    </span>
                  )
              }.bind(this),
          },
          {
              Header: 'State of Trade',
              accessor: '',
              Cell: function(props) {
                  return (
                    <span>
                      <React.Fragment>
                        <div>
                          {props.original.take_ok ? 'Acepted' : 'Pending'}
                        </div>
                      </React.Fragment>
                    </span>
                  )
              },
          },
          {
              Header: '',
              accessor: '',
              Cell: function(props) {
                  return (
                      <span>
                        {
                          props.original.take_ok ?
                          (
                            <div></div>
                          ) : (
                            <UpdateRequest
                              _id={props.original._id}
                              authenticated={this.state.authenticated}
                              user_id={this.state.user_id}
                              user={this.state.user} />
                          )
                        }
                      </span>
                  )
              }.bind(this),
          },
        ]

        let showTable = true
        if (!trades.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Title>My Trades</Title>
                {showTable && !isLoading && (
                    <ReactTable
                        data={trades}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}

                {!showTable && (
                    <hr />
                )}

                {isLoading && (
                    <h3>Loading Trades</h3>
                )}
            </Wrapper>
        )
    }
}

export default TradesList
