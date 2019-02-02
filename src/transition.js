import React from 'react'
import { StyleSheet, Animated } from 'react-native'

// type Props = {
//   config: any,
//   configIn: any,
//   configOut: any,
//   animation: animatedValue => any,
//   anim?: any,
//   in: boolean,
//   children: any,
//   onTransitionEnd: () => void,
// }

// type State = {
//   anim: any,
// }

class Transition extends React.Component {
  static defaultProps = {
    config: {
      timing: Animated.spring,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    configIn: {},
    configOut: {},
    animation: anim => {
      return {
        transform: {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0],
            extrapolate: 'clamp',
          }),
        },
      }
    },
    onTransitionEnd: () => {},
  }

  state = {
    anim: this.props.anim || new Animated.Value(0),
  }

  componentDidMount() {
    if (this.props.in) {
      Animated.spring(this.state.anim, {
        ...this.props.config,
        ...this.props.configIn,
        useNativeDriver: true,
        toValue: 1,
      }).start(this.props.onTransitionEnd)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.in !== this.props.in) {
      if (this.props.in) {
        Animated.spring(this.state.anim, {
          ...this.props.config,
          ...this.props.configIn,
          useNativeDriver: true,
          toValue: 1,
        }).start(this.props.onTransitionEnd)
      } else {
        Animated.spring(this.state.anim, {
          ...this.props.config,
          ...this.props.configOut,
          useNativeDriver: true,
          toValue: 0,
        }).start(this.props.onTransitionEnd)
      }
    }
  }

  render() {
    const animation = this.props.animation(this.state.anim)

    return (
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          ...animation,
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

export default Transition
