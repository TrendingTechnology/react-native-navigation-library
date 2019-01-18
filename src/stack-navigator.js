import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Screen from './screen'

class Stack extends React.Component {
  render() {
    // console.log(this.props)
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.props.transitioning
        ? Math.max(this.props.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1,
    )

    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          return (
            <Screen
              {...this.props}
              {...child.props}
              index={index}
              in={index <= this.props.activeIndex}
            >
              {cloneWithNavigation(child, this.props, {
                index,
                in: index <= this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export default createNavigationScreenContainer(Stack)
