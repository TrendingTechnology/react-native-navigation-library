import React from 'react'
import { StyleSheet, Animated } from 'react-native'
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
            inputRange: [0, 1],
            outputRange: [0, 0],
            extrapolate: 'clamp',
          }),
        },
      ]
    },
    onTransitionEnd: () => {},
  }

  state = {
    anim: this.props.anim || new Animated.Value(0),
  }

  componentDidMount() {
    if (this.props.in) {
      Animated.spring(this.state.anim, {
        ...this.props.animationConfig,
        ...this.props.animationConfigIn,
        toValue: 1,
      }).start(this.props.onTransitionEnd)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.in !== this.props.in) {
      if (this.props.in) {
        Animated.spring(this.state.anim, {
          ...this.props.animationConfig,
          ...this.props.animationConfigIn,
          toValue: 1,
        }).start(this.props.onTransitionEnd)
      } else {
        Animated.spring(this.state.anim, {
          ...this.props.animationConfig,
          ...this.props.animationConfigOut,
          toValue: 0,
        }).start(this.props.onTransitionEnd)
      }
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
