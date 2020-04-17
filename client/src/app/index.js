import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { NavBar } from '../components'
import { BooksList,
         BooksInsert,
         BooksUpdate,
         MyBooksList,
         BooksRequests,
         RequestsList,
         RequestsInsert,
         MyRequestsList,
         UsersList,
         UsersBooks,
         UsersRequests,
         UsersUpdate,
         TradesList,
         MyTradesList,
       } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: '',
      user_id: '',
      user: '',
      isLoading: false,
    }
  }
  componentDidMount = async () => {
    this.setState({
      isLoading: true,
    })

    await fetch("/api/auth/login/success", { // express
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
            isLoading: false,
          })
        } else {
          this.setState({
            authenticated: false,
            user_id: '',
            user: '',
            isLoading: false,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })

  }
  render() {
    console.log('app', this.state)
    const { authenticated, user_id, user, isLoading, } = this.state
    return (
      <Router>

      {!isLoading ?
         authenticated ?
         (
           <>
            <NavBar
              authenticated={authenticated}
              user_id={user_id}
              user={user}
            />
            <Switch>
              <Route path="/" exact component={BooksList} />
              <Route path="/book/insert" exact component={BooksInsert} />
              <Route path="/book/:_id/update" exact component={BooksUpdate} />
              <Route path="/book/:_id/requests" exact component={BooksRequests} />
              <Route path="/mybooks" exact component={MyBooksList} />
              <Route path="/requests" exact component={RequestsList} />
              <Route path="/request/insert" exact component={RequestsInsert} />
              <Route path="/myrequests" exact component={MyRequestsList} />
              <Route path="/users" exact component={UsersList} />
              <Route path="/user/:_id" render={(props) => (
                <UsersUpdate key={props.match.params._id} {...props} />
              )} />
              <Route path="/user/:_id/books" exact component={UsersBooks} />
              <Route path="/user/:_id/requests" exact component={UsersRequests} />
              <Route path="/trades" exact component={TradesList} />
              <Route path="/mytrades" exact component={MyTradesList} />
              <Redirect to="/" />
            </Switch>
          </>
         )
         :
         (
           <>
            <NavBar
              authenticated={authenticated}
              user_id={user_id}
              user={user}
            />
            <Switch>
              <Route path="/" exact component={BooksList} />
              <Route path="/book/:_id/requests" exact component={BooksRequests} />
              <Route path="/requests" exact component={RequestsList} />
              <Route path="/users" exact component={UsersList} />
              <Route path="/user/:_id" exact component={UsersUpdate} />
              <Route path="/user/:_id/books" exact component={UsersBooks} />
              <Route path="/user/:_id/requests" exact component={UsersRequests} />
              <Route path="/trades" exact component={TradesList} />
              <Redirect to="/" />
            </Switch>
          </>
         )
         :
         (
           <div></div>
         )
      }

      </Router>
    )
  }
}

export default App
