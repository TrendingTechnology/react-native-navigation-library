import React from 'react'
import { Dimensions } from 'react-native'
import { withNavigation } from './navigator'
import Screen from './screen'

const { height: screenHeight } = Dimensions.get('window')

class Modal extends React.Component {
  state = {
    active: false,
    transitioning: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.navigation) {
      if (nextProps.navigation.modal.active !== prevState.active) {
        return {
          active: nextProps.navigation.modal.active,
          transitioning: nextProps.animated,
        }
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

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

    if (!this.state.transitioning && !this.state.active) {
      return null
    }

    return (
      <Screen
        index={this.props.activeIndex}
        animated={this.props.animated}
        transition={{
          in: this.props.navigation.modal.active,
          onTransitionEnd: this.handleTransitionEnd,
        }}
        animationTransform={this.animation}
      >
        {React.cloneElement(child, { navigation: this.props.navigation })}
      </Screen>
    )
  }
}

export { Modal }
export default withNavigation(Modal)
