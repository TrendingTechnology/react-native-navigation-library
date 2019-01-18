import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createNavigationScreen } from './navigator'
import Transition from './transition'

class Screen extends React.Component {
  render() {
    // console.log(this.props)
    return (
      <Transition {...this.props}>
        <View style={[this.props.style || styles.screen]}>
          {this.props.children}
        </View>
      </Transition>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})

export default createNavigationScreen(Screen)
