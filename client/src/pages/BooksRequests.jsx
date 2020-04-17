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

class BooksRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            requestsGive: [],
            requestsTake: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
            backURL: this.props.location.state.backURL,
            title: '',
            author: '',
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })
        const { _id } = this.state

        await api.getBookById(_id).then(book => {
          this.setState({
            title: book.data.data.title,
            author: book.data.data.author,
          })
        })
        .catch(error => {
          console.log(error)
        })

        await api.getRequestsByGiveBookId(_id).then(requests => {
            this.setState({
                requestsGive: requests.data.data,
            })
        })
        .catch(error => {
          console.log(error)
        })

        await api.getRequestsByTakeBookId(_id).then(requests => {
            this.setState({
                requestsTake: requests.data.data,
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
      console.log('books requests', this.state)
        const { requestsGive, requestsTake, isLoading, authenticated, user_id, user, backURL, _id, title, author, } = this.state
        const requests = [...requestsGive, ...requestsTake]
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
                                    backURL: `/book/${_id}/requests`,
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
                <Label>Book: {title} - {author}</Label>
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
                    <h3>Loading Books</h3>
                )}
                <hr />
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: `/book/${_id}/requests`,
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Back</Link>
            </Wrapper>
        )
    }
}

export default BooksRequests
