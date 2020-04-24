import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { NavBar, } from '../components'
import { ClonesList,
         ClonesInsert,
         ClonesUpdate,
         MyClonesList,
         UsersList,
         UsersClones,
         UsersUpdate,
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
              <Route path="/" exact component={ClonesList} />
              <Route path="/clone/insert" exact component={ClonesInsert} />
              <Route path="/clone/:_id/update" exact component={ClonesUpdate} />
              <Route path="/myclones" exact component={MyClonesList} />
              <Route path="/users" exact component={UsersList} />
              <Route path="/user/:_id" exact component={UsersUpdate} />
              <Route path="/user/:_id/clones" exact component={UsersClones} />
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
              <Route path="/" exact component={ClonesList} />
              <Route path="/users" exact component={UsersList} />
              <Route path="/user/:_id" exact component={UsersUpdate} />
              <Route path="/user/:_id/clones" exact component={UsersClones} />
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
