import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const WrapperRow = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const WrapperRigth = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    float: rigth;
    width: 40%;
`
const WrapperLeft = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    float: left;
    width: 40%;
`
const Label = styled.label` margin: 5px; `

const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
`
const InputRadio = styled.input.attrs({ type: 'radio', })`
    margin: 5px;
`

class RequestsInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            give_book_id: '',
            take_book_id: '',
            take_ok: false,
            arrayBooksGive: [],
            arrayBooksTake: [],
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
            backURL: this.props.location.state.backURL,
        }
        this.cancelButtonRef = React.createRef()
    }
    handleChangeInputGive = event => {
        const give_book_id = event.target.id
        this.setState({ give_book_id })
    }
    handleChangeInputTake = event => {
        const take_book_id = event.target.id
        this.setState({ take_book_id })
    }
    handleIncludeRequest = async (event) => {
        event.preventDefault();
        const { give_book_id, take_book_id, take_ok, user_id, } = this.state
        if (!give_book_id || !take_book_id) return

        const payload = { give_book_id: give_book_id, take_book_id: take_book_id, user_id: user_id, take_ok: take_ok }

        await api.insertRequest(payload).then(res => {
            window.alert(`Request inserted successfully`)
            this.setState({
              give_book_id: '',
              take_book_id: '',
            })
        })
        .catch(error => {
          console.log(error)
        })

        this.cancelButtonRef.current.click()
    }
    componentDidMount = async () => {
      const { user_id, } = this.state

      await api.getBooksByUserId(user_id).then(books => {
        const arrayBooksGive = books.data.data.map((item, ind) =>
          <div key={item.title.toString().substr(0,5).trim() + ind.toString()}>
            <InputRadio id={item._id}
                        name="booksGive"
                        value={item.title + ' - ' + item.author}
                        onChange={this.handleChangeInputGive} />
            <Label>{item.title + ' - ' + item.author}</Label>
          </div>
        )
        this.setState({
          arrayBooksGive: arrayBooksGive,
        })
      })

      await api.getAllBooks().then(books => {
        const booksF = books.data.data.filter((item, ind) => item.user_id._id !== user_id)
        const arrayBooksTake = booksF.map((item, ind) =>
          <div key={item.title.toString().substr(0,5).trim() + ind.toString()}>
            <InputRadio id={item._id}
                        name="booksTake"
                        value={item.title.trim() + ' - ' + item.author.trim()}
                        onChange={this.handleChangeInputTake} />
            <Label>{item.title + ' - ' + item.author}</Label>
          </div>
        )
        this.setState({
          arrayBooksTake: arrayBooksTake,
        })
      })

    }
    render() {
      console.log('requests insert', this.state)
        const { arrayBooksGive, arrayBooksTake, authenticated, user_id, user, backURL, } = this.state
        return (
            <Wrapper>
                <Title>Create Request</Title>
                <WrapperRow>
                  <WrapperLeft>
                    <Label>Book to give: </Label>
                    {arrayBooksGive}
                  </WrapperLeft>
                  <WrapperRigth>
                    <Label>Book to take: </Label>
                    {arrayBooksTake}
                  </WrapperRigth>
                </WrapperRow>
                <Button onClick={this.handleIncludeRequest}>Add Request</Button>
                <Link to={{ pathname: backURL || '/',
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: '/request/insert',
                            }
                          }} className="btn btn-danger" ref={this.cancelButtonRef}>Cancel</Link>
            </Wrapper>
        )
    }
}

export default RequestsInsert
