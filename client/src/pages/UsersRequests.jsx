import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``
const Label = styled.label`
    margin: 5px;
`

class UsersRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            requests: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
            backURL: this.props.location.state.backURL,
            name: '',
            screenName: '',
            fullName: '',
        }
    }
    componentDidMount = async () => {
      this.setState({ isLoading: true })
      const { _id } = this.state

      await api.getUserById(_id).then(user => {
        this.setState({
            name: user.data.data.name,
            screenName: user.data.data.screenName,
            fullName: user.data.data.fullName,
        })
      })
      .catch(error => {
        console.log(error)
      })

      await api.getRequestsByUserId(_id).then(requests => {
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
      console.log('users requests', this.state)
        const { requests, isLoading, authenticated, user_id, user, backURL, _id, name, screenName, fullName, } = this.state
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
                                    backURL: `/user/${_id}/requests`,
                                  }
                                }}
                                className="nav-link" >{props.original.user_id.screenName}</Link>
                        </React.Fragment>
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
                <Title>Requests</Title>
                <Label>User: {screenName} - {name} - {fullName}</Label>
                <hr />
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
                    <h3>Loading Users</h3>
                )}
                <hr />
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: `/user/${_id}/requests`,
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Back</Link>
            </Wrapper>
        )
    }
}

export default UsersRequests
