import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const Label = styled.label` margin: 5px; `
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
`

class BooksInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
          authenticated: this.props.location.state.authenticated,
          user_id: this.props.location.state.user_id,
          user: this.props.location.state.user,
          backURL: this.props.location.state.backURL,
          title: '',
          author: '',
        }
        this.cancelButtonRef = React.createRef()
    }
    handleChangeInputTitle = event => {
        const title = event.target.value
        this.setState({ title })
    }
    handleChangeInputAuthor = event => {
        const author = event.target.value
        this.setState({ author })
    }
    handleIncludeBook = async (event) => {
        event.preventDefault();
        const { title, author, user_id, } = this.state
        if (!title || !author) return

        const payload = { title: title, author: author, user_id: user_id }

        await api.insertBook(payload).then(res => {
            window.alert(`Book inserted successfully`)
            this.setState({
              title: '',
              author: '',
            })
        })
        .catch(error => {
          console.log(error)
        })

        this.cancelButtonRef.current.click()
    }
    render() {
      console.log('insert', this.state)
        const { title, author, authenticated, user_id, user, backURL, } = this.state
        return (
            <Wrapper>
                <Title>Create Book</Title>

                <Label>Title: </Label>
                <InputText
                    type="text"
                    value={title}
                    onChange={this.handleChangeInputTitle}
                />

                <Label>Author: </Label>
                <InputText
                    type="text"
                    value={author}
                    onChange={this.handleChangeInputAuthor}
                />

                <Button onClick={this.handleIncludeBook}>Add Book</Button>
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: '/book/insert',
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Cancel</Link>
            </Wrapper>
        )
    }
}

export default BooksInsert
