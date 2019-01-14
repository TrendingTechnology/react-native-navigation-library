import React from 'react'
import { createModalNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

/*
Example: 
  <Navigator>
    <Stack>
      <Screen 1 />
      <Screen 2 />
      <Screen 3 />
    </Stack>

    <Modal>
      <Modal 1 />
      <Modal 2 />
      <Modal 3 />
    </Modal>
  </Navigator>
*/

class Modal extends React.Component {
  state = {
    popIndex: -1,
    activeIndex: this.props.activeIndex,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        popIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
      }
    }

    return null
  }

  animation = (anim) => {
    return [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1000, 0],
        }),
      },
    ]
  }

  handleTransitionEnd = () => {
    this.setState({
      popIndex: -1,
    })
  }

  render() {
    const children = React.Children.toArray(this.props.children)
    const child =
      children[
        this.state.popIndex >= 0 ? this.state.popIndex : this.props.activeIndex
      ]

    if (!child) {
      return null
    }

    return (
      <Transition
        animationTransform={this.animation}
        transitionOut={this.state.popIndex !== -1}
        transitionIn={this.props.activeIndex >= 0}
        onTransitionEnd={this.handleTransitionEnd}>
        {cloneWithNavigation(child, this.props)}
      </Transition>
    )
  }
}

export default createModalNavigationContainer(Modal)
