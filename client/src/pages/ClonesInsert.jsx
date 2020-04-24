import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import { Upload } from '../components'

const Card = styled.div.attrs({ className: 'form-group', })`
  background-color: white;
  padding: 32px;
  margin: 5px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
`
const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const WrapperImage = styled.div.attrs({ className: 'form-group', })`
    display: flex;
    "flex-direction": row;
    "box-sizing": border-box;
`
const Label = styled.label`
    margin: 5px;
    display: initial;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
    display: initial;
`
const InputTextArea = styled.textarea.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
`

class ClonesInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
          authenticated: this.props.location.state.authenticated,
          user_id: this.props.location.state.user_id,
          user: this.props.location.state.user,
          backURL: this.props.location.state.backURL,
          title: '',
          text: '',
          url: '',
          file: null,
          fileName: '',
          likes: 0,
          views: 0,
          disabledFile: false,
          validUrl: false,
        }
        this.cancelButtonRef = React.createRef()
        this.urlInputRef = React.createRef()
        this.fileImputRef = React.createRef()
        this.urlPictureRef = React.createRef()
        this.filePictureRef = React.createRef()
        this.urlLabelRef = React.createRef()
        this.fileLabelRef = React.createRef()

        this.setUrlPicture = this.setUrlPicture.bind(this)
    }
    handleChangeInputTitle = event => {
        const title = event.target.value
        this.setState({ title })
    }
    handleChangeInputText = event => {
        const text = event.target.value
        this.setState({ text })
    }
    handleChangeInputUrl = event => {
        if (this.state.fileName) return
        const url = event.target.value
        if (url) {
          this.setUrlPicture(url)
          this.setState({ url: url, file: null, fileName: '', disabledFile: true, })
        } else {
          this.setState({ url: url, file: null, fileName: '', disabledFile: false, })
        }
    }
    handleIncludeClone = async (event) => {
        event.preventDefault()
        const { title, text, url, fileName, likes, views, user_id, } = this.state
        if (!title || !text) return
        if (!url && !fileName) return

        const payload = { title: title,
                          text: text,
                          url: url,
                          file: ( fileName ? user_id + '-' +fileName : ''),
                          likes: likes,
                          views: views,
                          user_id: user_id,
                        }

        await api.insertClone(payload).then(res => {
            window.alert(`Clone inserted successfully`)
            this.setState({
              title: '',
              text: '',
              url: '',
              fileName: '',
              file: null,
            })
        })
        .catch(error => {
          console.log(error)
        })

        this.cancelButtonRef.current.click()
    }
    setUrlPicture (url) {
      let promises = []
      promises.push(
        new Promise((resolve, reject) => {
          let image = document.createElement('img')
          image.src = url
          image.onload = () => {
            resolve(true)
          }
          image.onerror = () => {
            resolve(false)
          }
        })
      )
      Promise
        .all(promises)
        .then((values) => {
          this.setState({ validUrl: values[0] })
        })
    }
    render() {
      console.log('clones insert', this.state)
        const { title, text, url, authenticated, user_id, user, backURL, disabledFile, validUrl, } = this.state

        return (
            <Wrapper>
                <Title>Create Clone</Title>

                <form>
                  <Label>Title: </Label>
                  <InputText
                      type="text"
                      value={title}
                      onChange={this.handleChangeInputTitle}
                  />

                  <Label>Text: </Label>
                  <InputTextArea
                      type="text"
                      value={text}
                      onChange={this.handleChangeInputText}
                  />

                  <Label ref={this.urlLabelRef}>URL picture: </Label>
                  <WrapperImage>
                    <InputText
                        type="text"
                        value={url}
                        onChange={this.handleChangeInputUrl}
                        ref={this.urlInputRef}
                    />
                    <div id="urlPicture"
                         ref={this.urlPictureRef}
                         dangerouslySetInnerHTML={ validUrl ?
                           (
                             { __html: '<img src="' + url  + '" width="100px" height="100px" />' }
                           ) : (
                             { __html: '' }
                           )
                         }></div>
                  </WrapperImage>

                  <Label ref={this.fileLabelRef}>File picture: </Label>
                  <Card className="Card">
                    <Upload user_id={user_id}
                            _this={this}
                            disabled={disabledFile} />
                  </Card>

                  <Button onClick={this.handleIncludeClone}>Add Clone</Button>
                  <Link to={{ pathname: backURL || '/',
                              state: {
                                authenticated: authenticated,
                                user_id: user_id,
                                user: user,
                                backURL: '/clone/insert',
                              }
                            }} className="btn btn-danger" ref={this.cancelButtonRef}>Cancel</Link>
                </form>
            </Wrapper>
        )
    }
}

export default ClonesInsert
