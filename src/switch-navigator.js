import React from 'react'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'

class Switch extends React.Component {
  state = {
    rendered: [this.props.activeIndex],
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState(state => {
        const previous = state.rendered.filter(
          i => i !== this.props.activeIndex,
        )
        return {
          rendered: [...previous, this.props.activeIndex],
        }
      })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)
    const child = children[this.state.rendered[this.state.rendered.length - 1]]
    return cloneWithNavigation(child, this.props)
  }
}

export default createNavigationContainer(Switch)
