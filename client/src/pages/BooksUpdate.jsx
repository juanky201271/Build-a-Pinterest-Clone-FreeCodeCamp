import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const Label = styled.label`
    margin: 5px;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
    display: initial;
`
//const CancelButton = styled.Link.attrs({ className: `btn btn-danger`, })`
//    margin: 15px 15px 15px 5px;
//`

class BooksUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            title: '',
            author: '',
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
            backURL: this.props.location.state.backURL,
        }
        this.updateButtonRef = React.createRef()
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
    handleUpdateBook = async (event) => {
      event.preventDefault();
      const { _id, title, author, } = this.state

      const payload = { title: title, author: author, }
      await api.updateBookById(_id, payload).then(res => {
        window.alert(`Book updated successfully`)
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
    componentDidMount = async () => {
      var { _id } = this.state
      await api.getBookById(_id).then(book => {
        this.setState({
          title: book.data.data.title,
          author: book.data.data.author,
        })
      })
      .catch(error => {
        console.log(error)
      })

    }
    render() {
        console.log('books update', this.state)
        const { title, author, authenticated, user_id, user, backURL, _id } = this.state

        return (
            <Wrapper>
                <Title>Update Book</Title>

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

                <Button id="updateButton" onClick={this.handleUpdateBook} ref={this.updateButtonRef}>Update Book</Button>
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: `/book/${_id}/update`,
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Cancel</Link>
            </Wrapper>
        )
    }
}

export default BooksUpdate
