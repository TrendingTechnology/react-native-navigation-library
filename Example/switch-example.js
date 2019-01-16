import React from 'react'
import { View, Text, Button } from 'react-native'
import { Navigator, Switch } from 'react-native-navigation-library'

class SwitchExample extends React.Component {
  state = {
    activeIndex: 0,
    navigation: {},
  }

  handleNavigationChange = updates => {
    this.setState(updates)
  }

  render() {
    return (
      <Navigator onNavigationChange={this.handleNavigationChange}>
        <Switch>
          <MyScreen title="Switch 1" />
          <MyScreen title="Switch 2" />
          <MyScreen title="Switch 3" />
          <MyResetScreen title="Switch 4" />
        </Switch>
      </Navigator>
    )
  }
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
