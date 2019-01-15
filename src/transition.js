import React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { screenWidth } from './lib'

class Transition extends React.Component {
  static defaultProps = {
    animationConfig: {
      timing: Animated.spring,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      useNativeDriver: true,
    },
    animationConfigIn: {},
    animationConfigOut: {},

    animationTransform: anim => {
      return [
        {
          translateX: anim.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [screenWidth, screenWidth * 0.4, 0],
            extrapolate: 'clamp',
          }),
        },
      ]
    },
  }

  state = {
    anim: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(this.state.anim, {
      ...this.props.animationConfig,
      ...this.props.animationConfigIn,
      toValue: 1,
    }).start()
  }

  componentDidUpdate(prevProps) {
    if (this.props.transitionOut && !prevProps.transitionOut) {
      Animated.timing(this.state.anim, {
        ...this.props.animationConfig,
        ...this.props.animationConfigOut,
        toValue: 0,
      }).start(this.props.onTransitionEnd)
    }

    if (this.props.transitionIn && !prevProps.transitionIn) {
      Animated.timing(this.state.anim, {
        ...this.props.animationConfig,
        ...this.props.animationConfigOut,
        toValue: 1,
      }).start(this.props.onTransitionEnd)
    }
  }

  render() {
    const transform = this.props.animationTransform(this.state.anim)

    return (
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: transform,
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

export default Transition
