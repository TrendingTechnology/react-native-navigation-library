import React from 'react'
import { View, Text, Button } from 'react-native'
import { Navigator, Stack, Header } from 'react-native-navigation-library'

function StackExample() {
  return (
    <Navigator>
      <Header>
        <MyHeader title="Header 1" />
        <MyHeader title="Header 2" />
        <MyHeader title="Header 3" />
        <MyHeader title="Header 4" />
      </Header>

      <Stack>
        <MyScreen title="Stack 1" />
        <MyScreen title="Stack 2" />
        <MyScreen title="Stack 3" />
        <MyResetScreen title="Stack 4" />
      </Stack>
    </Navigator>
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

        {props.index > 0 && (
          <Button title="Previous" onPress={() => props.navigation.pop()} />
        )}
        <Button title="Next" onPress={() => props.navigation.push()} />
      </View>
    </View>
  )
}

function MyResetScreen(props) {
  return (
    <View style={{ flex: 1 }}>
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

        <Button title="Previous" onPress={() => props.navigation.pop()} />
        <Button title="Reset stack" onPress={() => props.navigation.reset()} />
      </View>
    </View>
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

export default StackExample
