import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Transition from './transition'

const { width: screenWidth } = Dimensions.get('window')

class Screen extends React.Component {
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
    if (!this.props.animated) {
      return (
        <View
          style={[
            {
              flex: 1,
              ...StyleSheet.absoluteFillObject,
            },
            this.props.style,
          ]}
        >
          {this.props.children}
        </View>
      )
    }

    const {
      transition,
      animationConfig,
      animationConfigIn,
      animationConfigOut,
    } = this.props

    return (
      <Transition
        {...transition}
        animationTransform={this.animationTransform}
        animationConfig={animationConfig}
        animationConfigIn={animationConfigIn}
        animationConfigOut={animationConfigOut}
      >
        <View style={[{ flex: 1 }, this.props.style]}>
          {this.props.children}
        </View>
      </Transition>
    )
  }
}

export default Screen
