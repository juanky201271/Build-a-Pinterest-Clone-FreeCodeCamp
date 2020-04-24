import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'
import { Link } from 'react-router-dom'
import Masonry from 'react-masonry-component'

const masonryOptions = {
  transitionDuration: 0
}
const imagesLoadedOptions = {
  background: '.my-bg-image-el'
}

const WrapperGen = styled.div`
  margin: 5px 5px 5px 5px;
  padding: 10px 10px 10px 10px;
`
const Wrapper = styled.div`
  margin: 5px 5px 5px 5px;
  padding: 10px 10px 10px 10px;
  background-color: #ddd;
  border-radius: 10px;
  border: 1px solid magenta;
  width: 200px;
`
const Title = styled.h1.attrs({ className: 'h1', })``
const Title3 = styled.h3.attrs({ className: 'h3', })`
  font-weight: bold;
  cursor: pointer;
`
const Title4 = styled.h5.attrs({ className: 'h5', })``
const Img = styled.img`
  max-width: 200px;
  min-width: 100px;
  cursor: pointer;
`
const Icon = styled.img`
  cursor: pointer;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
`
const TextUser = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: magenta;
  cursor: pointer;
`
const Text = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #555;
  display: none;
`
const Delete = styled.div.attrs({ className: 'btn btn-danger'})`
  cursor: pointer;
`

class DeleteClone extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const { _id, _this, user_id, } = this.props
    if (window.confirm(`Do tou want to delete the clone ${_id} permanently?`,)) {

      await api.deleteCloneById(_id)
      .catch(error => {
        console.log(error)
      })
      await api.updateUserRemoveLikeById(_id)
      .catch(error => {
        console.log(error)
      })
      await api.updateUserRemoveViewById(_id)
      .catch(error => {
        console.log(error)
      })

      _this.setState(state => {
        var cl = []
        state.clones.map((item, index) => {
          if (item._id === _id) {
            return null
          } else {
            return cl.push(item)
          }
        })
        return { clones: cl }
      })


    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class MyClonesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clones: [],
            columns: [],
            isLoading: false,
            authenticated: this.props.location.state.authenticated,
            user_id: this.props.location.state.user_id,
            user: this.props.location.state.user,
        }
        this.handleClickMasonry = this.handleClickMasonry.bind(this)
    }
    componentDidMount = async () => {
      this.setState({ isLoading: true })
      const { user_id } = this.state
      await api.getClonesByUserId(user_id).then(clones => {
        this.setState({
            clones: clones.data.data,
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
    handleClickMasonry (event) {
      console.log('Masonry', event.target.id)
      const clone_id = event.target.id.split("-")[0]
      const obj = event.target.id.split("-")[1]

      if (!clone_id || !obj) return

      console.log(document.getElementById(clone_id))
      if (obj !== 'likes') {
        if (document.getElementById(clone_id).style.width === "400px") {
          document.getElementById(clone_id).style.width="200px"
        } else {
          document.getElementById(clone_id).style.width="400px"
        }
        if (document.getElementById(clone_id + '-text').style.display === "initial")
        {
          document.getElementById(clone_id + '-text').style.display="none"
        } else {
          document.getElementById(clone_id + '-text').style.display="initial"
        }
        this.masonry.layout()
      }

    }
    render() {
      console.log('myclones', this.state)
        const { clones, isLoading, authenticated, user, user_id, } = this.state
        const userViews = user.views || []
        const userLikes = user.likes || []
        const cloneElements = clones.map((item, index) => {
           return (
                <Wrapper key={item.title.substr(0,10).trim() + index.toString()} id={item._id}>
                  <Col>
                    { userViews.filter((view, index) => view === item._id).length > 0 ?
                       item.url ?
                          (
                            <Img src={item.url} alt={item.url} id={item._id + '-imgUrlViewed-' + item.views.toString()} />
                          ) : (
                            <Img src={process.env.PUBLIC_URL + '/images/' + item.file} id={item._id + '-imgFileViewed-' + item.views.toString()} />
                          )
                        :
                      item.url ?
                          (
                            <Img src={item.url} alt={item.url} id={item._id + '-imgUrl-' + item.views.toString()} />
                          ) : (
                            <Img src={process.env.PUBLIC_URL + '/images/' + item.file} id={item._id +'-imgFile-' + item.views.toString()} />
                          )

                    }
                    { userViews.filter((view, index) => view === item._id).length > 0 ?
                      (
                        <Title3 id={item._id + '-h3Viewed-' + item.views.toString()}>{item.title}</Title3>
                      ) : (
                        <Title3 id={item._id + '-h3-' + item.views.toString()}>{item.title}</Title3>
                      )
                    }

                    <Text id={item._id + '-text'}>{item.text}</Text>

                    <Row>
                      <Link to={{ pathname: `/user/${item.user_id._id}/clones`,
                              state: {
                                authenticated: authenticated,
                                user_id: user_id,
                                user: user,
                                backURL: '/clones',
                              }
                            }}
                            className="nav-link" ><TextUser>{item.user_id.screenName}</TextUser></Link>
                      { userLikes.filter((like, index) => like === item._id).length > 0 ?
                        (
                          <Icon src={process.env.PUBLIC_URL + '/favorite-black-18dp.svg'}
                                className="img-fluid "
                                data-toggle="tooltip" title="I love it!"
                                id={item._id + '-likesViewed-' + item.views.toString()} />
                        ) : (
                          <Icon src={process.env.PUBLIC_URL + '/favorite_border-black-18dp.svg'}
                                className="img-fluid "
                                data-toggle="tooltip" title="I like this!"
                                id={item._id + '-likes-' + item.likes.toString()} />
                        )
                      }
                      <Title4>{item.likes}</Title4>

                      { userViews.filter((view, index) => view === item._id).length > 0 ?
                        (
                          <Icon src={process.env.PUBLIC_URL + '/fullscreen-black-18dp.svg'}
                                className="img-fluid "
                                data-toggle="tooltip" title="I already read it!"
                                id={item._id + '-viewsViewed-' + item.views.toString()} />
                        ) : (
                          <Icon src={process.env.PUBLIC_URL + '/fullscreen_exit-black-18dp.svg'}
                                className="img-fluid "
                                data-toggle="tooltip" title="I want to read this!"
                                id={item._id + '-views-' + item.views.toString()} />
                        )
                      }
                      <Title4>{item.views}</Title4>
                    </Row>
                    <Row>
                      <DeleteClone _id={item._id}
                                   _this={this}
                                   user_id={user_id} />
                      { item.likes > 0 ?
                        (
                          <Link to={{ pathname: `/clone/${item._id}/update`,
                                      state: {
                                        authenticated: authenticated,
                                        user_id: user_id,
                                        user: user,
                                        backURL: `/myclone`,
                                      }
                                    }} className="btn btn-secondary" ref={this.cancelButtonRef} style={{ pointerEvents: "none" }}>Update</Link>
                        ) : (
                          <Link to={{ pathname: `/clone/${item._id}/update`,
                                      state: {
                                        authenticated: authenticated,
                                        user_id: user_id,
                                        user: user,
                                        backURL: `/myclone`,
                                      }
                                    }} className="btn btn-success" ref={this.cancelButtonRef}>Update</Link>
                        )
                      }
                    </Row>
                  </Col>
                </Wrapper>
            )
        })


        let showTable = true
        if (!clones.length) {
            showTable = false
        }

        return (
            <WrapperGen>
                <Title>My Clones</Title>
                <hr />
                {showTable && !isLoading && (
                  <Masonry
                      className={'my-gallery-class'} // default ''
                      elementType={'div'} // default 'div'
                      options={masonryOptions} // default {}
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                      imagesLoadedOptions={imagesLoadedOptions} // default {}
                      onClick={this.handleClickMasonry}
                      ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)}
                  >
                    {cloneElements}
                  </Masonry>
                )}
            </WrapperGen>
        )
    }
}

export default MyClonesList
