import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { createNavigationContainer } from './navigator'

const DEFAULT_HEIGHT = 49

class TabBar extends React.Component {
  render() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        active: index === this.props.activeIndex,
        navigation: {
          onSelect: () => this.props.navigation.select(index),
        },
      })
    })
  }
}

class TabBarContainer extends React.Component {
  render() {
    const { style, ...rest } = this.props
    return (
      <View style={[styles.tabbar, style]}>
        <TabBar {...rest} />
      </View>
    )
  }
}

class Tab extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[{ flex: 1, backgroundColor: 'white' }, this.props.style]}
        onPress={this.props.navigation.onSelect}
      >
        {React.cloneElement(this.props.children, {
          active: this.props.active,
        })}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  tabbar: {
    height: DEFAULT_HEIGHT,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
})

export { Tab }
export default createNavigationContainer(TabBarContainer)
