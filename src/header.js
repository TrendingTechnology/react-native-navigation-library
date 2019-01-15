import React from 'react'
import { View } from 'react-native'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'

class Header extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)
    const child = children[this.props.activeIndex]

    if (!child) {
      return null
    }

    return (
      <View
        style={[{ height: 60, backgroundColor: 'white' }, this.props.style]}>
        {cloneWithNavigation(child, this.props, {
          activeIndex: this.props.activeIndex,
        })}
      </View>
    )
  }
}

export default createNavigationContainer(Header)
