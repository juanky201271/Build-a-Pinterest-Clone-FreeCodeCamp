import React, { Component } from 'react'
import styled from 'styled-components'
import { Dropzone, Progress, } from '../components'

const UploadDiv = styled.div`
  display: flex;
  "flex-direction": column;
  flex: 1;
  "align-items": flex-start;
  "text-align": left;
  overflow: hidden;
`
const Content = styled.div`
  display: flex;
  "flex-direction": row;
  "padding-top": 16px;
  "box-sizing": border-box;
`
const File = styled.div`
  margin-left: 32px;
  align-items: flex-start;
  justify-items: flex-start;
  flex: 1;
  overflow-y: auto;
`
const Actions = styled.div`
  margin-left: 32px;
  display: flex;
  flex: 1;
  align-items: flex-end;
  flex-direction: column;
  width: 80%;
`
const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  padding: 8px;
  overflow: hidden;
  box-sizing: border-box;
`
const Col = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
  padding: 8px;
  overflow: hidden;
  box-sizing: border-box;
`
const FileName = styled.span`
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
`
const ProgressWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`
const CheckIcon = styled.img`
  opacity: 0.5;
  margin-left: 32px;
`
const ButtonUpload = styled.button.attrs({ className: `btn btn-secondary`, })`
    margin: 15px 15px 15px 5px;
`
const ButtonClear = styled.button.attrs({ className: `btn btn-warning`, })`
    margin: 15px 15px 15px 5px;
`
const ImageUploaded = styled.img`
  opacity: 0.8;
  margin-left: 32px;
  width: 100px;
  height: 100px;
`

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false,
      error: '',
      clear: false,
    }
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.uploadFiles = this.uploadFiles.bind(this)
    this.sendRequest = this.sendRequest.bind(this)
    this.renderActions = this.renderActions.bind(this)
  }
  onFilesAdded(files) {
    const _this = this.props._this
    this.setState(prevState => ({
      files: files,
    }))
    if (files.length) {
      _this.setState({ fileName: files[0].name, file: files[0], validFile: false, })
    }
  }
  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name]
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <ProgressWrapper>
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <CheckIcon
            alt="done"
            src={process.env.PUBLIC_URL + "/check_circle_outline-black-18dp.svg"}
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </ProgressWrapper>
      )
    }
  }
  renderActions() {
    return (
      <>
      { this.state.files.length > 0 ?
        (
          <ButtonClear
            onClick={() => {
              const _this = this.props._this
              this.setState({ files: [], successfullUploaded: false, clear: true, })
              _this.setState({ fileName: '', file: null, validFile: false, })
            }}
          >
            Clear
          </ButtonClear>
        ) : (
          <></>
        )
      }
      { !this.state.successfullUploaded ?
        (
          <ButtonUpload
            disabled={this.state.files.length < 1 || this.state.files.length > 1 || this.state.uploading || this.props.disabled}
            onClick={this.uploadFiles}
            style={{ cursor: this.state.files.length < 1 || this.state.files.length > 1 || this.state.uploading || this.props.disabled ? "default" : "pointer" }}
          >
            Upload
          </ButtonUpload>
        ) : (
          <></>
        )
      }
      </>
    )
  }
  async uploadFiles() {
    const _this = this.props._this
    this.setState({ uploadProgress: {}, uploading: true })
    const promises = []
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file))
    })
    try {
      await Promise.all(promises)

      this.setState({ error: '', successfullUploaded: true, uploading: false })
      _this.setState({ validFile: true, })
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ error: e, successfullUploaded: true, uploading: false })
    }
  }
  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()

      req.upload.addEventListener("progress", event => {
         if (event.lengthComputable) {
            const copy = { ...this.state.uploadProgress }
            copy[file.name] = {
               state: "pending",
               percentage: (event.loaded / event.total) * 100
            }
            this.setState({ uploadProgress: copy })
         }
      })

      req.upload.addEventListener("load", event => {
         const copy = { ...this.state.uploadProgress }
         copy[file.name] = { state: "done", percentage: 100 }
         this.setState({ uploadProgress: copy })
         resolve(req.response)
      })

      req.upload.addEventListener("error", event => {
         const copy = { ...this.state.uploadProgress }
         copy[file.name] = { state: "error", percentage: 0 }
         this.setState({ uploadProgress: copy })
         reject(req.response)
      })

      const formData = new FormData()
      formData.append("file", file, file.name)

      //api.upload(formData)

      req.open("POST", `/api/upload/${this.props.user_id}`)
      req.send(formData)
    })
  }
  render() {
    console.log('upload', this.state, this.props)
    return (
      <UploadDiv>
        <Content>
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded || this.props.disabled}
              clear={this.state.clear}
            />
          </div>
        </Content>
        <File>
          {this.state.files.map(file => {
            return (
              <Row key={file.name}>

                { this.state.successfullUploaded ?
                  (
                    <Col>
                      <ImageUploaded src={process.env.PUBLIC_URL + '/images/' + this.props.user_id + '-' + file.name} />
                    </Col>
                  ) : (
                    <div></div>
                  )
                }
                <Col>
                  <FileName className="Filename">{file.name}</FileName>
                  {this.renderProgress(file)}
                </Col>

              </Row>
            )
          })}
        </File>
        <Actions>{this.renderActions()}</Actions>
      </UploadDiv>
    )
  }
}

export default Upload
