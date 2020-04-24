import React, { Component } from 'react'
import styled from 'styled-components'

const Drop = styled.div`
  height: 130px;
  width: 130px;
  background-color: #fff;
  border: 2px dashed rgb(187, 186, 186);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
`
const InputFile = styled.input`
  display: none;
`
const Icon = styled.img`
  opacity: 0.3;
  height: 64px;
  width: 64px;
`

class Dropzone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hightlight: false,
    }
    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.fileInputRef = React.createRef()
  }
  openFileDialog() {
    if (this.props.disabled) return
    this.fileInputRef.current.value = null
    this.fileInputRef.current.click()
  }
  onFilesAdded(evt) {
    if (this.props.disabled) return
    const files = evt.target.files
    console.log(files)
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
  }
  fileListToArray(list) {
    const array = []
    for (var i = 0; i < list.length; i++) {
      if (list.item(i).type.substr(0, 6) === 'image/') {
        array.push(list.item(i))
      }
    }
    return array
  }
  onDragOver(evt) {
    evt.preventDefault()
    if (this.props.disabled) return
    this.setState({ hightlight: true })
  }
  onDragLeave() {
    this.setState({ hightlight: false })
  }
  onDrop(event) {
    event.preventDefault()
    if (this.props.disabled) return
    const files = event.dataTransfer.files
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
    this.setState({ hightlight: false })
  }
  render() {
    console.log('Dropzone', this.state, this.props)
    return (
      <Drop onClick={this.openFileDialog}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            className={`background-color: ${this.state.hightlight ? "bg-secondary" : ""}`}
            style={{ cursor: this.props.disabled ? "default" : "pointer" }}>
        <Icon
          alt="upload"
          src={process.env.PUBLIC_URL + "/cloud_upload-black-18dp.svg"}
        />
        <InputFile
          ref={this.fileInputRef}
          type="file"
          accept="images/*"
          onChange={this.onFilesAdded}
        />
        <span>Upload Image</span>
      </Drop>
    )
  }
}

export default Dropzone
