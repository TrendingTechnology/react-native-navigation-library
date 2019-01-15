import React from 'react'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

class Switch extends React.Component {
  render() {
    const child = React.Children.toArray(this.props.children)[
      this.props.transitionIndex >= 0
        ? this.props.transitionIndex
        : this.props.activeIndex
    ]

    return (
      <Transition
        transitionOut={this.props.transitionIndex >= 0}
        onTransitionEnd={this.props.onTransitionEnd}>
        {cloneWithNavigation(child, this.props)}
      </Transition>
    )
  }
}

export default createNavigationContainer(Switch)
