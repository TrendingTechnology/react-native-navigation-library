import React from 'react'
import { cloneWithNavigation } from './lib'

class Header extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)
    const child = children[this.props.activeIndex]

    if (!child) {
      return null
    }

    return cloneWithNavigation(child, this.props, {
      activeIndex: this.props.activeIndex,
    })
  }
}

export default Header