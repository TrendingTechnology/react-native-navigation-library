import React from 'react'
import { View, Text, Button } from 'react-native'
import { Screen, Navigator, Stack } from 'react-native-navigation-library'

function ScreenExample() {
  return (
    <Navigator>
      <Stack>
        <Screen>
          {({ navigation }) => {
            return <MyScreen title="Screen 1" navigation={navigation} />
          }}
        </Screen>

        <Screen
          style={{
            position: 'absolute',
            left: 30,
            right: 30,
            top: 100,
            bottom: 100,
            borderWidth: 1,
          }}
        >
          <MiniScreen title="A mini screen" />
        </Screen>
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

function MiniScreen(props) {
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

        <Button title="Previous" onPress={() => props.navigation.pop()} />
      </View>
    </View>
  )
}

export default ScreenExample
