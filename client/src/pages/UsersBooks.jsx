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

class UsersBooks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            books: [],
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

      await api.getBooksByUserId(_id).then(books => {
        this.setState({
            books: books.data.data,
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
      console.log('users books', this.state)
        const { books, isLoading, authenticated, user_id, user, backURL, _id, name, screenName, fullName, } = this.state
        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Title',
                accessor: 'title',
                filterable: true,
            },
            {
                Header: 'Author',
                accessor: 'author',
                filterable: true,
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
                                    backURL: `/user/${_id}/books`,
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
                          <React.Fragment>
                            <Link to={{ pathname: `/book/${props.original._id}/requests`,
                                    state: {
                                      authenticated: this.state.authenticated,
                                      user_id: this.state.user_id,
                                      user: this.state.user,
                                      backURL: `/user/${_id}/books`,
                                    }
                                  }}
                                  className="nav-link" >Requests</Link>
                          </React.Fragment>
                        </span>
                    )
                }.bind(this),
            },
        ]

        let showTable = true
        if (!books.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Title>My Books</Title>
                <Label>User: {screenName} - {name} - {fullName}</Label>
                <hr />
                {showTable && !isLoading && (
                    <ReactTable
                        data={books}
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
                    <h3>Loading Books</h3>
                )}
                <hr />
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: `/user/${_id}/books`,
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Back</Link>
            </Wrapper>
        )
    }
}

export default UsersBooks
