import React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { screenWidth } from './lib'
import { withTransitioner } from './transitioner'

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
    },
    animationConfigIn: {},
    animationConfigOut: {},
    useNativeDriver: true,
  }

  state = {
    anim: new Animated.Value(0),
  }

  componentDidMount() {
    if (this.props.in) {
      Animated.timing(this.state.anim, {
        toValue: 1,
      }).start(this.props.onTransitionEnd)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.in !== this.props.in) {
      if (this.props.in) {
        Animated.timing(this.state.anim, {
          ...this.props.animationConfigIn,
          ...this.props.animationConfig,
          toValue: 1,
        }).start(this.props.onTransitionEnd)
      } else {
        Animated.timing(this.state.anim, {
          ...this.props.animationConfigOut,
          ...this.props.animationConfig,
          toValue: 0,
        }).start(this.props.onTransitionEnd)
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.optimized) {
      return (
        nextProps.activeIndex === this.props.index ||
        nextProps.previousIndex === this.props.index
      )
    }

    return true
  }

  animationTransform = anim => {
    if (this.props.animationTransform) {
      return this.props.animationTransform(anim)
    }

    let outputRange = []

    if (this.props.index === this.props.activeIndex) {
      if (this.props.previousIndex > this.props.index) {
        outputRange = [-screenWidth, 0]
      } else {
        outputRange = [screenWidth, 0]
      }
    } else {
      if (this.props.index < this.props.activeIndex) {
        outputRange = [-screenWidth, 0]
      } else {
        outputRange = [screenWidth, 0]
      }
    }

    return [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: outputRange,
          extrapolate: 'clamp',
        }),
      },
    ]
  }

  render() {
    const transform = this.animationTransform(this.state.anim)

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

export default withTransitioner(Transition)
