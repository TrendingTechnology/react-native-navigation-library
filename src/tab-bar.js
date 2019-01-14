import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createNavigationContainer } from './navigator'

class TabBar extends React.Component {
  render() {
    return (
      <View style={[{ flexDirection: 'row' }, this.props.style]}>
        {React.Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, {
            active: index === this.props.activeIndex,
            navigation: {
              onSelect: () => this.props.navigation.select(index),
            },
          })
        })}
      </View>
    )
  }
}

class Tab extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          { flex: 1, height: 60, backgroundColor: 'white' },
          this.props.style,
        ]}
        onPress={this.props.navigation.onSelect}>
        {React.cloneElement(this.props.children, {
          active: this.props.active,
        })}
      </TouchableOpacity>
    )
  }
}

export { Tab }
export default createNavigationContainer(TabBar)
