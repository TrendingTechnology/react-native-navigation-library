import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createNavigationScreen } from './navigator'
import { createTransitionContainer } from './transitioner'
import Transition from './transition'

const TransitionContainer = createTransitionContainer(Transition)

class Screen extends React.Component {
  render() {
    return (
      <TransitionContainer {...this.props}>
        <View style={[styles.screen, this.props.style]}>
          {this.props.children}
        </View>
      </TransitionContainer>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})

export default createNavigationScreen(Screen)
