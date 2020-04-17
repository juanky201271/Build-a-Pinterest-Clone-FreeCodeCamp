import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``

class BooksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            books: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state ? this.props.location.state.authenticated : '',
            user_id: this.props.location.state ? this.props.location.state.user_id : '',
            user: this.props.location.state ? this.props.location.state.user : '',
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await fetch("/api/auth/login/success", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept:
            "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        })
          .then(response => {
            if (response.status === 200) return response.json()
            throw new Error("failed to authenticate user")
          })
          .then(responseJson => {
            if (responseJson.success === true) {
              this.setState({
                authenticated: true,
                user_id: responseJson.user._id,
                user: responseJson.user,
              })
            } else {
              this.setState({
                authenticated: false,
                user_id: '',
                user: '',
              })
            }
          })
          .catch(error => {
            console.log(error)
          })

        await api.getAllBooks().then(books => {
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
      console.log('books', this.state)
        const { books, isLoading } = this.state
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
                                    backURL: '/',
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
                                    backURL: '/',
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
                <Title>Books</Title>
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
            </Wrapper>
        )
    }
}

export default BooksList
