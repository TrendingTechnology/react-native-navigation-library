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

  render() {
    const children = React.Children.toArray(this.props.children)

    const child =
      children[
        this.props.transitionIndex >= 0
          ? this.props.transitionIndex
          : this.props.activeIndex
      ]

    if (!child) {
      return null
    }

    return (
      <Transition
        animationTransform={this.animation}
        transitionOut={this.props.transitionIndex >= 0}
        transitionIn={this.props.activeIndex >= 0}
        onTransitionEnd={this.props.onTransitionEnd}>
        {cloneWithNavigation(child, this.props)}
      </Transition>
    )
  }
}

export default createModalNavigationContainer(Modal)
