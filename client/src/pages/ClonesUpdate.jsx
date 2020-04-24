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
    flex-direction: row;
    box-sizing: border-box;
`
const WrapperFile = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 0px 10px 0px 0px;
    width: 100%;
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
    display: initial; // if have likes or views the update button is hiding
`
const ButtonRemove = styled.a.attrs({ className: `btn btn-primary`, })`
    margin: 5px;
`
class ClonesUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
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
            validFile: false,
        }
        this.updateButtonRef = React.createRef()
        this.cancelButtonRef = React.createRef()
        this.urlInputRef = React.createRef()
        this.fileImputRef = React.createRef()
        this.urlPictureRef = React.createRef()
        this.filePictureRef = React.createRef()
        this.urlLabelRef = React.createRef()
        this.fileLabelRef = React.createRef()

        this.setUrlPicture = this.setUrlPicture.bind(this)
        this.handleRemoveFile = this.handleRemoveFile.bind(this)
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
        this.setUrlPicture(url)
        if (url) {
          this.setState({ url: url, file: null, fileName: '', disabledFile: true, })
        } else {
          this.setState({ url: url, file: null, fileName: '', disabledFile: false, })
        }
    }
    handleUpdateClone = async (event) => {
      event.preventDefault()
      const { _id, title, text, url, fileName, likes, views, user_id, } = this.state
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

      await api.updateCloneById(_id, payload).then(res => {
        window.alert(`Clone updated successfully`)
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
    handleRemoveFile = (event) => {
      event.preventDefault()
      this.setState({ file: null, fileName: '', validFile: false, })
    }
    componentDidMount = async () => {
      const { _id } = this.state
      var likes
      await api.getCloneById(_id).then(clone => {
        likes = clone.data.data.likes
        if (clone.data.data.url) {
          this.setUrlPicture(clone.data.data.url)
        }
        this.setState({
          title: clone.data.data.title,
          text: clone.data.data.text,
          url: clone.data.data.url,
          fileName: clone.data.data.file
            .split("-")
            .filter((item, index) => ( index > 0 ))
            .join("-"),
          disabledFile: ( clone.data.data.url ? true : false ),
          validFile: ( clone.data.data.file ? true : false ),
        })
      })
      .catch(error => {
        console.log(error)
      })
      if ((likes) && this.updateButtonRef.current) {
        this.updateButtonRef.current.style.display="none"
      }
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
        console.log('clones update', this.state)
        const { title, text, url, fileName, authenticated, user_id, user, backURL, _id, disabledFile, validUrl, validFile, } = this.state

        return (
            <Wrapper>
                <Title>Update Clone</Title>

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
                  <WrapperImage>
                    <WrapperFile>
                        <InputText
                            type="text"
                            value={fileName}
                            ref={this.fileInputRef}
                            disabled={true}
                        />
                        { validFile ?
                          (
                            <ButtonRemove id="removeFile" onClick={this.handleRemoveFile}>Remove File Picture</ButtonRemove>
                          ) : (
                            <div></div>
                          )
                        }
                    </WrapperFile>
                      <div id="filePicture"
                           style={{ margin: "5px" }}
                           ref={this.filePictureRef}
                           dangerouslySetInnerHTML={ validFile ?
                             (
                               { __html: '<img src="' +
                                          process.env.PUBLIC_URL +
                                          '/images/' +
                                          user_id + '-' + fileName +
                                          '" width="100px" height="100px" />' }
                            ) : (
                              { __html: '' }
                            )
                          }
                      ></div>
                  </WrapperImage>

                  <Label ref={this.fileLabelRef}>Change File picture: </Label>
                  <Card className="Card">
                    <Upload user_id={user_id}
                            _this={this}
                            disabled={disabledFile} />
                  </Card>
                  <div id="filePicture" ref={this.filePictureRef}></div>

                  <Button id="updateButton" onClick={this.handleUpdateClone} ref={this.updateButtonRef}>Update Clone</Button>
                  <Link to={{ pathname: backURL || '/',
                              state: {
                                authenticated: authenticated,
                                user_id: user_id,
                                user: user,
                                backURL: `/clone/${_id}/update`,
                              }
                            }} className="btn btn-danger" ref={this.cancelButtonRef}>Cancel</Link>
              </form>
            </Wrapper>
        )
    }
}

export default ClonesUpdate
