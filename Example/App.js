import React, { Component } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native'

import {
  Navigator,
  Stack,
  Header,
  TabBar,
  Tabs,
  Switch,
  Screen,
  Modal,
} from 'react-native-navigation-library'

import {
  BasicTabs,
  NestedTabs,
  TabsWithHeaders,
  TabsWithHeadersAndTabBar,
} from './tabs'

function TabsExampleIndexPage(props) {
  return (
    <View style={styles.container}>
      <Button title="Tabs" onPress={props.navigateToTabs} />
      <Button title="Nested Tabs" onPress={props.navigateToNestedTabs} />
      <Button
        title="Tabs with Headers"
        onPress={props.navigateToTabsWithHeaders}
      />
      <Button title="Everything Tab Bar" onPress={props.navigateToEverything} />

      <Button title="Modal test" onPress={props.displayModal} />
      <Button title="Modal test 2" onPress={props.displaySecondModal} />
    </View>
  )
}

function TabsExamples() {
  return (
    <Navigator>
      <Header>
        <HeaderView title="Index Page" />
        <HeaderView title="Basic Tabs Page" />
        <HeaderView title="Nested Tabs Page" />
        <HeaderView title="Tabs with Headers Page" />
        <HeaderView title="Everything Page" />
      </Header>
      <Tabs>
        <Screen
          navigator={(navigation) => {
            return {
              navigateToTabs: () => navigation.push(1, { test: 'value' }),
              navigateToNestedTabs: () => navigation.push(2),
              navigateToTabsWithHeaders: () => navigation.push(3),
              navigateToEverything: () => navigation.push(4),
              displayModal: () => navigation.modal.push(0, { test: 'value' }),
              displaySecondModal: () =>
                navigation.modal.push(1, { test: 'second value' }),
            }
          }}>
          <TabsExampleIndexPage />
        </Screen>
        <BasicTabs />
        <NestedTabs />
        <TabsWithHeaders />
        <TabsWithHeadersAndTabBar />
      </Tabs>

      <Modal>
        <Screen>
          <ModalView name="1" />
        </Screen>
        <Screen>
          <ModalView name="2" />
        </Screen>
      </Modal>
    </Navigator>
  )
}

function ModalView(props) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text>{props.name}</Text>
      <Text>{props.data.test}</Text>
      <Button title="Dismiss" onPress={() => props.navigation.modal.pop()} />
    </View>
  )
}

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Navigator>
          <Switch>
            <TabsExamples />
          </Switch>
        </Navigator>
      </SafeAreaView>
    )
  }
}

class Main extends React.Component {
  state = {
    tabBarVisible: true,
    headerVisible: true,
  }

  handleNavigation = (innerActiveIndex) => {
    if (innerActiveIndex > 0) {
      this.setState({
        tabBarVisible: false,
      })
    } else {
      this.setState({ tabBarVisible: true, headerVisible: true })
    }
  }

  handleSettingsNavigation = (activeIndex) => {
    if (activeIndex === 2) {
      this.setState({ tabBarVisible: false })
    } else {
      this.setState({ tabBarVisible: true })
    }
  }

  handleLogout = () => {
    this.props.navigation.pop()
  }

  render() {
    return (
      <Navigator onNavigationChange={this.handleSettingsNavigation}>
        {this.state.headerVisible && (
          <Header>
            {this.state.tabBarVisible ? (
              <HeaderView title="Feed" />
            ) : (
              <EmptyHeader />
            )}
            {this.state.tabBarVisible ? (
              <HeaderView title="Nested Feed" />
            ) : (
              <EmptyHeader />
            )}
            <HeaderView title="Settings" />
          </Header>
        )}

        <Tabs>
          <Feed name="1" onNavigationChange={this.handleNavigation} />
          <NestedFeed name="2" onNavigationChange={this.handleNavigation} />
          <Settings name="3" onLogout={this.handleLogout} />
        </Tabs>

        {this.state.tabBarVisible && (
          <View style={{ height: 60, flexDirection: 'row' }}>
            <TabBar>
              <Tab name="feed" />
              <Tab name="nested feed" />
              <Tab name="profile" />
            </TabBar>
          </View>
        )}
      </Navigator>
    )
  }
}

function Settings(props) {
  return (
    <View style={styles.container}>
      <Text>Settings Page</Text>
      <Button title="Logout" onPress={props.onLogout} />
    </View>
  )
}

function NestedFeed(props) {
  return (
    <Navigator {...props}>
      <Header>
        <EmptyHeader />
        <HeaderView title={props.name} />
      </Header>
      <Stack>
        <FeedView name={props.name} />
        <ProfileView />
      </Stack>
    </Navigator>
  )
}

class Feed extends React.Component {
  state = {
    selectedProfile: null,
  }

  handleCardPress = (card, cb) => {
    this.setState(
      {
        selectedProfile: card,
      },
      cb,
    )
  }

  render() {
    return (
      <Navigator {...this.props}>
        <Header>
          <EmptyHeader />
          <HeaderView title="profile" />
        </Header>
        <Stack>
          <SingleFeed
            name={this.props.name}
            onItemPress={this.handleCardPress}
          />
          <ProfileView profile={this.state.selectedProfile} />
        </Stack>
      </Navigator>
    )
  }
}

function FeedView(props) {
  const navigateToProfile = () => props.navigation.push()
  return (
    <Navigator {...props}>
      <View
        style={{ flexDirection: 'row', height: 60, backgroundColor: 'white' }}>
        <TabBar>
          <Tab name="inner-1" />
          <Tab name="inner-2" />
          <Tab name="inner-3" />
        </TabBar>
      </View>
      <Tabs>
        <SingleFeed name="inner-1" navigateToProfile={navigateToProfile} />
        <SingleFeed name="inner-2" navigateToProfile={navigateToProfile} />
        <SingleFeed name="inner-3" navigateToProfile={navigateToProfile} />
      </Tabs>
    </Navigator>
  )
}

function SingleFeed(props) {
  function Card(props) {
    return (
      <View style={{ height: 100, borderWidth: 1 }}>
        <Button
          title={`Go to profile: ${props.name}`}
          onPress={props.onPress}
        />
      </View>
    )
  }

  const navigateToProfile = props.navigateToProfile
    ? props.navigateToProfile
    : props.onItemPress

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{`Feed ${props.name}!`}</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1, borderWidth: 1 }}
          data={[{ key: 'a', name: 'a' }, { key: 'b', name: 'b' }]}
          renderItem={({ item }) => (
            <Card
              {...item}
              onPress={() =>
                navigateToProfile(item, () => props.navigation.push())
              }
            />
          )}
        />
      </View>
      <Button
        title="Go to profile"
        onPress={() =>
          props.navigateToProfile
            ? props.navigateToProfile()
            : props.navigation.push()
        }
      />
    </View>
  )
}

function ProfileView(props) {
  return (
    <View style={styles.container}>
      <Text>Profile View!</Text>
      <Text>{props.name}</Text>
    </View>
  )
}

class Entry extends React.Component {
  state = {
    headerVisible: true,
  }

  handleSubmit = () => {
    this.props.navigation.push()
  }

  handleSignupNavigation = (newActiveIndex) => {
    if (newActiveIndex > 0) {
      this.setState({ headerVisible: false })
    }
  }

  render() {
    return (
      <Navigator>
        {this.state.headerVisible && (
          <Header>
            <EmptyHeader />
            <HeaderView title="Login" />
          </Header>
        )}
        <Tabs>
          <Home />
          <Login onSubmit={this.handleSubmit} />
          <Signup
            onSubmit={this.handleSubmit}
            onNavigationChange={this.handleSignupNavigation}
          />
        </Tabs>
      </Navigator>
    )
  }
}

function Tab(props) {
  return (
    <View style={{ flex: 1, borderWidth: props.active ? 1 : 0 }}>
      <Button title={props.name} onPress={props.navigation.onSelect} />
    </View>
  )
}

function EmptyHeader() {
  return null
}

function HeaderView(props) {
  return (
    <View
      style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
      }}>
      <View style={{ flex: 1 }}>
        {props.activeIndex !== 0 && (
          <Button title="Go back" onPress={() => props.navigation.pop()} />
        )}

        {props.navigation.parent && props.activeIndex === 0 && (
          <Button
            title="Go back to parent"
            onPress={() => props.navigation.parent.pop()}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 20 }}>{props.title}</Text>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  )
}

function Home(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>First Screen!</Text>
      <Button title="Login" onPress={() => props.navigation.push()} />
      <Button title="Signup" onPress={() => props.navigation.push(2)} />
    </View>
  )
}

function Login(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Login screen</Text>
      <Text>Username: </Text>
      <TextState />

      <Text>Password: </Text>
      <TextState />

      <Button title="Submit" onPress={props.onSubmit} />
    </View>
  )
}

function Signup(props) {
  return (
    <Navigator {...props}>
      <Header>
        <HeaderView title="Signup Form" />
        <HeaderView title="Nested Form" />
      </Header>
      <Stack>
        <SignupForm title="Signup Form" />
        <Form title="Nested Form" onSubmit={() => props.onSubmit()} />
      </Stack>
    </Navigator>
  )
}

function SignupForm(props) {
  return <Form title={props.title} onSubmit={() => props.navigation.push()} />
}

function Form(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{props.title}</Text>
      <Text>Username: </Text>
      <TextState />

      <Text>Password: </Text>
      <TextState />

      <Button title="Submit" onPress={props.onSubmit} />
    </View>
  )
}

class TextState extends React.Component {
  state = {
    inputValue: '',
  }

  render() {
    return (
      <View style={{ height: 60, padding: 10 }}>
        <TextInput
          autoCapitalize={'none'}
          value={this.state.value}
          onChangeText={(text) => this.setState({ inputValue: text })}
          placeholder="Enter Text here"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
