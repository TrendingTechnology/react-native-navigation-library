import React from 'react'
import { withNavigation } from './navigator'
import { screenHeight } from './lib'

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

    if (!child) {
      return null
    }

    return React.cloneElement(child, {
      transition: {
        animationTransform: this.animation,
        in: this.props.navigation.modal.active,
        index: this.props.activeIndex,
        optimized: true,
      },
    })
  }
}

export { Modal }
export default withNavigation(Modal)
