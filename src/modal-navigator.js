import React from 'react'
import { createModalNavigationContainer } from './navigator'
import { cloneWithNavigation, screenHeight } from './lib'

/*

Modals are mapped to an individual screen (e.g <Screen 1 /> and <Modal 1 /> in markup below) and are displayed via props.navigation.modal.push
They can also be selected/pushed from any screen via props.navigation.modal.select(indexOfModal)

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
  For Screen 1 to display Modal 3 : props.navigation.modal.select(2)
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

    return cloneWithNavigation(child, this.props, {
      animationTransform: this.animation,
      in: this.props.navigation.modal.active,
    })
  }
}

export default createModalNavigationContainer(Modal)
