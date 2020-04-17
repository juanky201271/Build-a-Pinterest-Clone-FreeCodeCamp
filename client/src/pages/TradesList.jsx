import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``

class TradesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trades: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getRequestsByTakeOk(true).then(trades => {
          this.setState({
              trades: trades.data.data,
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
      console.log('trades', this.state)
        const { trades, isLoading } = this.state
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
                                  backURL: '/trades',
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
                                  backURL: '/trades',
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
        ]

        let showTable = true
        if (!trades.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Title>Trades</Title>
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
