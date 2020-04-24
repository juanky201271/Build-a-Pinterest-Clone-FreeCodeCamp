import React, { Component } from 'react'
import styled from 'styled-components'

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgb(183, 155, 229);
  border-radius: 5px;
`
const ProgressDiv = styled.div`
  background-color: #cc88cc;
  height: 100%;
  margin: 0;
  border-radius: 5px;
`

class Progress extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <ProgressBar>
        <ProgressDiv
          style={{ width: this.props.progress + '%' }}
        />
      </ProgressBar>
    )
  }
}

export default Progress
