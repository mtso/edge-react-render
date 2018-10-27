import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name || '',
    }
  }
  render() {
    const { name } = this.state
    return (
      <div>
        Hello, {name}.
      </div>
    )
  }
}
