import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import { TransitionContainer } from './transitioner'

class Stack extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.props.transitioning
        ? Math.max(this.props.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1,
    )

    return React.Children.map(children, (child, index) => {
      return (
        <TransitionContainer in={index <= this.props.activeIndex} index={index}>
          {cloneWithNavigation(child, this.props, {
            index,
          })}
        </TransitionContainer>
      )
    })
  }
}

class StackNavigator extends React.Component {
  render() {
    const { style, ...rest } = this.props
    return (
      <View style={[{ flex: 1 }, style]}>
        <Stack {...rest} />
      </View>
    )
  }
}

export default createNavigationScreenContainer(StackNavigator)
