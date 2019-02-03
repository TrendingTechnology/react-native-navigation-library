import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes, Platform } from 'react-native'
import { withScreenNavigation } from './navigator'
import Screen from './screen'

// type Props = {
//   activeIndex: number,
//   children: any,
//   style: any,
//   screenStyle: any,
//   animated: boolean,
//   transition: {
//     config: any,
//     configIn: any,
//     configOut: any,
//     animation: animatedValue => any,
//     onTransitionEnd: () => void,
//   },
//   navigation: Navigation,
// }

// type State = {
//   activeIndex: number,
//   previousIndex?: number,
//   transitioning: boolean,
// }

import { fadeInOut, slideInOut } from './animations'

class Stack extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
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
  }

  state = {
    activeIndex: this.props.activeIndex,
    previousIndex: null,
    transitioning: false,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        previousIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
        transitioning: nextProps.animated,
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.state.transitioning
        ? Math.max(this.state.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1
    )

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          const focused = index === this.props.activeIndex

          const indices = [
            index,
            this.state.previousIndex,
            this.props.activeIndex,
          ]

          const animation = Platform.select({
            ios: slideInOut(indices),
            android: fadeInOut,
          })

          return (
            <Screen
              index={index}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              screen={{
                testID: focused ? `active-screen` : `inactive-screen-${index}`,
                optimized: false,
                animated: this.props.animated || child.props.animated,
                style: { ...this.props.screenStyle, ...child.props.style },
              }}
              transition={{
                in: index <= this.props.activeIndex,
                onTransitionEnd: this.handleTransitionEnd,
                animation: animation,
                ...this.props.transition,
                ...child.props.transition,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: index === this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Stack }
export default withScreenNavigation(Stack)
