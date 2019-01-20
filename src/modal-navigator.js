import React from 'react'
import { createModalNavigationContainer } from './navigator'
import { cloneWithNavigation, screenHeight } from './lib'
import Screen from './screen'

/*

Modals are mapped to an individual screen (e.g <Screen 1 /> and <Modal 1 /> in markup below) and are displayed via props.navigation.modal.show()

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


  For Screen 1 to display Modal 1 : props.navigation.modal.show() 
  For Screen 2 to display Modal 2 : props.navigation.modal.show()
*/

class Modal extends React.Component {
  animation = anim => {
    return [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight, 0],
        }),
      },
    ]
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    const child = children[this.props.activeIndex]

    if (!child || child.props.hidden) {
      return null
    }

    return (
      <Screen
        {...this.props}
        index={this.props.activeIndex}
        in={this.props.navigation.modal.active}
        animationTransform={this.animation}
      >
        {cloneWithNavigation(child, this.props, {
          animationTransform: this.animation,
          in: this.props.navigation.modal.active,
        })}
      </Screen>
    )
  }
}

export default createModalNavigationContainer(Modal)
