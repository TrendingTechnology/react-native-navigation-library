import React from 'react'
import { View, Text } from 'react-native'
import {
  Navigator,
  Tabs,
  TabBar,
  Tab,
  Screen,
} from 'react-native-navigation-library'

function TabsExample() {
  return (
    <Navigator>
      <Tabs>
        <Screen>
          <MyScreen title="Screen 1" />
        </Screen>
        <Screen>
          <MyScreen title="Screen 2" />
        </Screen>
        <Screen>
          <MyScreen title="Screen 3" />
        </Screen>
      </Tabs>

      <TabBar>
        <Tab>
          <MyTab title="Tab 1" />
        </Tab>
        <Tab>
          <MyTab title="Tab 2" />
        </Tab>
        <Tab>
          <MyTab title="Tab 3" />
        </Tab>
      </TabBar>
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
      </View>
    </View>
  )
}

function MyTab(props) {
  return (
    <View style={{ flex: 1, padding: 5, backgroundColor: '#F5FCFF' }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: props.active ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 14, textAlign: 'center' }}>{props.title}</Text>
      </View>
    </View>
  )
}

export default TabsExample
