import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createNavigationScreen } from './navigator'

class Screen extends React.Component {
  render() {
    return (
      <View style={[styles.screen, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})

export default createNavigationScreen(Screen)
