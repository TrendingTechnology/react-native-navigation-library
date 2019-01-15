/* eslint-disable */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native'

import {
  Navigator,
  Stack,
  Header,
  TabBar,
  Tabs,
  Tab,
  Switch,
  Screen,
  Modal,
  Router,
  Route,
} from 'react-native-navigation-library'

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TabsExample />
      </SafeAreaView>
    )
  }
}

function NavigateExample() {
  return (
    <Navigator>
      <Tabs>
        <MyRoute name="Test-1" nextRoute="Test-3" />
        <MyRoute name="Test-2" nextRoute="Test-1" />
        <MyRoute name="Test-3" nextRoute="Test-2" />
      </Tabs>
    </Navigator>
  )
}

function MyRoute(props) {
  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={styles.title}>{props.name}</Text>
      <Text style={styles.subtitle}>{props.navigation.state.test}</Text>
      <Button
        title={`Go to ${props.nextRoute}`}
        onPress={() =>
          props.navigation.navigate(props.nextRoute, {
            test: `data passed from: ${props.name}`,
          })
        }
      />
    </View>
  )
}

function TabsExample() {
  return (
    <Navigator>
      <Header>
        <MyHeader title="Header 1" />
        <MyHeader title="Header 2" />
        <MyHeader title="Header 3" />
      </Header>

      <Tabs>
        <Panel title="Panel 1" subtitle="Panel 1" />
        <Panel title="Panel 2" subtitle="Panel 2" />
        <Panel title="Panel 3" subtitle="Panel 3" />
      </Tabs>

      <TabBar>
        <Tab>
          <MyTab text="Tab 1" />
        </Tab>
        <Tab>
          <MyTab text="Tab 2" />
        </Tab>
        <Tab>
          <MyTab text="Tab 3" />
        </Tab>
      </TabBar>
    </Navigator>
  )
}

function StackExample() {
  return (
    <Navigator>
      <Header>
        <StackHeader title="Header 1" />
        <StackHeader title="Header 2" />
        <StackHeader title="Header 3" />
        <StackHeader title="Header 4" />
      </Header>

      <Stack>
        <StackScreen title="Stack 1" />
        <StackScreen title="Stack 2" />
        <StackScreen title="Stack 3" />
        <Reset title="Stack 4" />
      </Stack>
    </Navigator>
  )
}

function Reset(props) {
  return (
    <View style={styles.container}>
      <StackScreen {...props} />
      <Button title="Reset" onPress={() => props.navigation.reset()} />
    </View>
  )
}

function ModalExample() {
  return (
    <Navigator>
      <Header>
        <MyHeader2 />
        <MyHeader2 />
        <MyHeader2 />
      </Header>

      <Switch>
        <Screen>
          <ModalPanel title="Modal Panel 1" />
        </Screen>

        <Screen>
          <ModalPanel title="Modal Panel 2" />
        </Screen>

        <Screen>
          <ModalPanel title="Modal Panel 3" />
        </Screen>
      </Switch>
      <Modal>
        <Screen>
          {({ navigation }) => {
            return (
              <DismissModal
                title="Modal Panel 1"
                navigation={navigation}
                dismiss={navigation.modal.dismiss}
              />
            )
          }}
        </Screen>

        <Screen>
          <ModalScreen title="2" />
        </Screen>

        <Screen>
          <ModalScreen title="3" />
        </Screen>
      </Modal>
    </Navigator>
  )
}

function MyHeader2(props) {
  return (
    <Button
      style={{ flex: 1 }}
      title="Go back"
      onPress={() => props.navigation.pop()}
    />
  )
}

function DismissModal(props) {
  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.navigation.state.title}</Text>
      <Button title="Dismiss modal" onPress={() => props.dismiss()} />
    </View>
  )
}

function ModalScreen(props) {
  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.navigation.state.title}</Text>
      <Button
        title="Dismiss modal"
        onPress={() => props.navigation.modal.dismiss()}
      />
    </View>
  )
}

function ModalPanel(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
      <Button title="Next" onPress={() => props.navigation.push()} />
      <Button
        title="Display modal"
        onPress={() => props.navigation.modal.show({ title: props.title })}
      />
    </View>
  )
}

function StackHeader(props) {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        {props.activeIndex !== 0 && (
          <Button title="Go back" onPress={() => props.navigation.pop()} />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <MyHeader {...props} />
      </View>

      <View style={{ flex: 1 }} />
    </View>
  )
}

function StackScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
      <Button title="Next" onPress={() => props.navigation.push()} />
      <Button title="Previous" onPress={() => props.navigation.pop()} />
    </View>
  )
}

function Panel(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
    </View>
  )
}

function MyTab(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: props.active ? 1 : 0,
      }}
    >
      <Text>{props.text}</Text>
    </View>
  )
}

function MyHeader(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: props.active ? 1 : 0,
      }}
    >
      <Text>{props.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
})
