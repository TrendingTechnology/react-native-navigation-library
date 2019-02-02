import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Dimensions, ViewPropTypes } from 'react-native'
import Transition from './transition'

const { width: screenWidth } = Dimensions.get('window')

// type Props = {
//   activeIndex: number,
//   previousIndex: number,
//   index: number,
//   children: any,

//   transition: {
//     in: boolean,
//     config?: any,
//     configIn?: any,
//     configOut?: any,
//     onTransitionEnd?: () => void,
//     animation?: (animatedValue: any) => any,
//   },

//   screen: {
//     style: any,
//     testID: string,
//     optimized: boolean,
//     animated: boolean,
//   },
// }

class Screen extends React.Component {
  static propTypes = {
    activeIndex: PropTypes.number,
    previousIndex: PropTypes.number,
    index: PropTypes.number.isRequired,
    transition: PropTypes.shape({
      in: PropTypes.bool.isRequired,
      config: PropTypes.object,
      configIn: PropTypes.object,
      configOut: PropTypes.object,
      onTransitionEnd: PropTypes.func,
      animation: PropTypes.func,
    }),
    screen: PropTypes.shape({
      style: ViewPropTypes.style,
      testID: PropTypes.string,
      optimized: PropTypes.bool,
      animated: PropTypes.bool,
    }),
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

  animation = anim => {
    if (this.props.transition.animation) {
      return this.props.transition.animation(anim)
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

    return {
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: outputRange,
            extrapolate: 'clamp',
          }),
        },
      ],
    }
  }

  render() {
    if (this.props.screen.animated) {
      return (
        <Transition animation={this.animation} {...this.props.transition}>
          <View
            testID={this.props.screen.testID}
            style={{ flex: 1, ...this.props.screen.style }}
          >
            {this.props.children}
          </View>
        </Transition>
      )
    }

    return (
      <View
        style={{
          flex: 1,
          ...StyleSheet.absoluteFillObject,
          ...this.props.screen.style,
        }}
      >
        {this.props.children}
      </View>
    )
  }
}

export default Screen
