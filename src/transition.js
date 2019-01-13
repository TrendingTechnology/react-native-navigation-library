import React from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'

class Transition extends React.Component {
  static defaultProps = {
    animationConfig: {
      duration: 500,
      easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    animationConfigIn: {},
    animationConfigOut: {},

    animationTransform: (anim) => {
      return [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 0],
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
        }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default Transition
