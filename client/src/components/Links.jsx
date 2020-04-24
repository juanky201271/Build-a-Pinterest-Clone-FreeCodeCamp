import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({ className: "collapse navbar-collapse" })``
const List = styled.div.attrs({ className: "navbar-nav mr-auto" })``
const Item = styled.div.attrs({ className: "collapse navbar-collapse text-dark" })``
const Log = styled.div.attrs({ className: "navbar-brand text-dark" })`
  cursor: pointer;
`
const Name = styled.div`
  color: #000;
  background: #cc88cc;
  padding: 5px;
`
const Pic = styled.img`
  width: 30px;
`

class Links extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      user_id: this.props.user_id || '',
      user: this.props.user || '',
    }
  }
  _handleLogoutClick = async () => {
    window.open("/api/auth/logout", "_self") // express
    this.props.handleNotAuthenticated()
    this.setState({ authenticated: false, user_id: '', user: '', })
  }
  _handleLoginClick = async () => {
    window.open("/api/auth/twitter", "_self")
  }
  render() {
    console.log('links', this.state)
    const { authenticated, user_id, user, } = this.state
    const name = user.fullName || user.name || ''
    const profileImageUrl = user.profileImageUrl || ''
    return (
      <React.Fragment>
        <Link to={{ pathname: "/",
                    state: {
                      authenticated: authenticated,
                      user_id: user_id,
                      user: user,
                      backURL: '/',
                    }
                  }}
          className="navbar-brand"
        >
          <Log>Clone-terest</Log>
        </Link>
        <Collapse>
          <List>


              <Link to={{ pathname: "/",
                          state: {
                            authenticated: authenticated,
                            user_id: user_id,
                            user: user,
                            backURL: '/',
                          }
                        }}
                className="nav-link"
              >
                <Item>Clones</Item>
              </Link>



              {
                authenticated ? (
                  <Link to={{ pathname: "/myclones",
                              state: {
                                authenticated: authenticated,
                                user_id: user_id,
                                user: user,
                                backURL: '/myclones',
                              }
                            }}
                    className="nav-link"
                  >
                    <Item>My CloneBoard</Item>
                  </Link>
                ) : (
                  <div></div>
                )
              }



            {
              authenticated ? (
                <Link to={{ pathname: "/clone/insert",
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: '/myclones',
                            }
                          }}
                  className="nav-link"
                >
                  <Item>Create Clone</Item>
                </Link>
              ) : (
                <div></div>
              )
            }



              <Link to={{ pathname: "/users",
                          state: {
                            authenticated: authenticated,
                            user_id: user_id,
                            user: user,
                            backURL: '/users',
                          }
                        }}
                className="nav-link"
              >
                <Item>Users</Item>
              </Link>


          </List>
          {
            authenticated ? (
              <Log onClick={this._handleLogoutClick}>
                Logout Twitter
              </Log>
            ) : (
              <Log onClick={this._handleLoginClick}>
                Login Twitter
              </Log>
            )
          }

          <List>

            {
              name === '' ?
              (
                <div></div>
              ) :
              (
                <Item>
                <Link to={{ pathname: `/user/${user_id}`,
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: '/users',
                              key: new Date(),
                            }
                          }}
                  className="nav-link"
                >
                  <Name>{name}</Name>
                </Link>
                </Item>
              )
            }

            {
              profileImageUrl === '' ?
              (
                <div></div>
              ) :
              (
                <Item>
                <Link to={{ pathname: `/user/${user_id}`,
                            state: {
                              authenticated: authenticated,
                              user_id: user_id,
                              user: user,
                              backURL: '/users',
                            }
                          }}
                  className="nav-link"
                >
                  <Pic src={profileImageUrl}></Pic>
                </Link>
                </Item>
              )
            }

          </List>


        </Collapse>
      </React.Fragment>
    )
  }
}

export default Links
