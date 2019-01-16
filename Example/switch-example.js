import React from 'react'
import { View, Text, Button } from 'react-native'
import { Navigator, Switch } from 'react-native-navigation-library'

function SwitchExample() {
  return (
    <Navigator>
      <Switch>
        <MyScreen title="Stack 1" />
        <MyScreen title="Stack 2" />
        <MyScreen title="Stack 3" />
        <MyResetScreen title="Stack 4" />
      </Switch>
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

export default SwitchExample
