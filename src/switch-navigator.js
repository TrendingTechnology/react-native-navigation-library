import React from 'react'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'

class Switch extends React.Component {
  render() {
    const child = React.Children.toArray(this.props.children)[
      this.props.activeIndex
    ]

    return cloneWithNavigation(child, this.props)
  }
}

export default createNavigationContainer(Switch)
