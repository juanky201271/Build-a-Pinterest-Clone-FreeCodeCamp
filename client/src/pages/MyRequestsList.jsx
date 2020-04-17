import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``
const Delete = styled.div` color: #ff0000; cursor: pointer; `

class DeleteRequest extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const { _id, } = this.props
    if (window.confirm(`Do tou want to delete the request ${_id} permanently?`,)) {

      await api.deleteRequestById(_id)
      .catch(error => {
        console.log(error)
      })

      window.location.href = '/Requests'
    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class MyRequestsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
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
      await api.getRequestsByUserId(user_id).then(requests => {
        this.setState({
            requests: requests.data.data,
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
      console.log('my requests', this.state)
        const { requests, isLoading } = this.state
        const columns = [
          {
              Header: 'ID',
              accessor: '_id',
              filterable: true,
          },
          {
              Header: 'Give',
              accessor: '',
              Cell: function(props) {
                  return (
                    <span>
                      <React.Fragment>
                        <div>
                          {props.original.give_book_id.title}<br />
                          {props.original.give_book_id.author}
                        </div>
                      </React.Fragment>
                    </span>
                  )
              },
          },
          {
              Header: 'Take',
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
                        <Link to={{ pathname: `/user/${props.original.user_id._id}`,
                                state: {
                                  authenticated: this.state.authenticated,
                                  user_id: this.state.user_id,
                                  user: this.state.user,
                                  backURL: '/myrequests',
                                }
                              }}
                              className="nav-link" >{props.original.user_id.screenName}</Link>
                      </React.Fragment>
                    </span>
                  )
              }.bind(this),
          },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteRequest
                              _id={props.original._id}
                              authenticated={this.state.authenticated}
                              user_id={this.state.user_id}
                              user={this.state.user} />
                        </span>
                    )
                }.bind(this),
            },
        ]

        let showTable = true
        if (!requests.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Title>My Requests</Title>
                {showTable && !isLoading && (
                    <ReactTable
                        data={requests}
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
                    <h3>Loading Requests</h3>
                )}
            </Wrapper>
        )
    }
}

export default MyRequestsList
