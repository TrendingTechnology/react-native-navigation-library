import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, ViewPropTypes } from 'react-native'
import { withModalNavigation } from './navigator'
import Screen from './screen'
import { mapScreenProps } from './lib'

const { height: screenHeight } = Dimensions.get('window')

class Modal extends React.Component {
  static propTypes = {
    activeIndex: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    screenStyle: ViewPropTypes.style,
    animated: PropTypes.bool,
    transition: PropTypes.shape({
      config: PropTypes.object,
      configIn: PropTypes.object,
      configOut: PropTypes.object,
      animation: PropTypes.func,
      onTransitionEnd: PropTypes.func,
    }),
    navigation: PropTypes.shape({
      modal: PropTypes.shape({
        active: PropTypes.bool,
      }),
    }),
  }

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
    return {
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [screenHeight, 0],
          }),
        },
      ],
    }
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

    const focused = this.props.navigation.modal.active

    const { screen, transition } = mapScreenProps(
      this.props.activeIndex,
      this.props,
      this.state,
      child
    )

    return (
      <Screen
        index={this.props.activeIndex}
        screen={screen}
        transition={{
          in: focused,
          onTransitionEnd: this.handleTransitionEnd,
          animation: this.animation,
          ...transition,
        }}
      >
        {React.cloneElement(child, {
          navigation: this.props.navigation,
          focused: focused,
        })}
      </Screen>
    )
  }
}

export { Modal }
export default withModalNavigation(Modal)
