import React, { Component } from 'react'
import styled from 'styled-components'

import Logo from './Logo'
import Links from './Links'

const Container = styled.div.attrs({ className: "container" })``
const Nav = styled.nav.attrs({ className: "navbar navbar-expand-lg navbar-dark bg-secondary " })`
  margin-bottom: 20px;
`

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      user_id: this.props.user_id || '',
      user: this.props.user || '',
    }
  }
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false, user_id: '', user: '', })
  }
  render() {
    console.log('navbar', this.state)
    const { authenticated, user_id, user,  } = this.state
    return (
      <Container>
        <Nav>
          <Logo />
          <Links
            authenticated={authenticated}
            user_id={user_id}
            user={user}
            handleNotAuthenticated={this._handleNotAuthenticated}
          />
        </Nav>
      </Container>
    )
  }
}

export default NavBar
