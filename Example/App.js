import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'

/* eslint-disable */
import TabsExample from './tabs-example'
import StackExample from './stack-example'
import SwitchExample from './switch-example'
import ModalExample from './modal-example'
import ScreenExample from './screen-example'
export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
        <ScreenExample />
      </SafeAreaView>
    )
  }
}
