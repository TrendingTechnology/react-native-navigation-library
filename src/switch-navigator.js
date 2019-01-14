import React from 'react'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

class Switch extends React.Component {
  state = {
    popIndex: -1,
    activeIndex: this.props.activeIndex,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        popIndex: nextProps.activeIndex,
        activeIndex: nextProps.activeIndex,
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({
      popIndex: -1,
    })
  }

  render() {
    const child = React.Children.toArray(this.props.children)[
      this.state.popIndex >= 0 ? this.state.popIndex : this.props.activeIndex
    ]

    return (
      <Transition
        transitionOut={this.state.popIndex !== -1}
        onTransitionEnd={this.handleTransitionEnd}>
        {cloneWithNavigation(child, this.props)}
      </Transition>
    )
  }
}

export default createNavigationContainer(Switch)
