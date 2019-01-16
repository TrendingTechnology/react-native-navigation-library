import React from 'react'
import { View, Button, Text } from 'react-native'

import {
  Navigator,
  Stack,
  Modal,
  Header,
} from 'react-native-navigation-library'

function ModalExample() {
  return (
    <Navigator>
      <Header>
        <MyHeader title="Header 1" />
        <MyHeader title="Header 2" />
        <MyHeader title="Header 3" />
      </Header>

      <Stack>
        <MyScreen title="Modal Panel 1" />
        <MyScreen title="Modal Panel 2" />
        <MyScreen title="Modal Panel 3" />
      </Stack>

      <Modal>
        <MyModal title="Modal for Panel 1" />
        <MyModal title="Modal for Panel 2" />
        <MyModal title="Modal for Panel 3" />
      </Modal>
    </Navigator>
  )
}

function MyHeader(props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F5FCFF',
        borderWidth: props.active ? 1 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        {props.activeIndex > 0 && (
          <Button title="Go back" onPress={() => props.navigation.pop()} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>{props.title}</Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  )
}

function MyScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 25,
        }}
      >
        <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>
          {props.title}
        </Text>

        <Button
          title="Display Modal"
          onPress={() => props.navigation.modal.show()}
        />
        <Button
          title="Go to next screen"
          onPress={() => props.navigation.push()}
        />
      </View>
    </View>
  )
}

function MyModal(props) {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F5FCFF' }}
    >
      <Text style={{ fontSize: 20, margin: 10, textAlign: 'center' }}>
        {props.title}
      </Text>
      <Button
        title="Dismiss modal"
        onPress={() => props.navigation.modal.dismiss()}
      />
    </View>
  )
}

export default ModalExample
