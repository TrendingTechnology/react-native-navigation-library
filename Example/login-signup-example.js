import React from 'react'
import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import {
  Navigator,
  Screen,
  Stack,
  Modal,
  Tabs,
  TabBar,
  Header,
  Tab,
  Switch,
} from 'react-native-navigation-library'

class App extends React.Component {
  render() {
    return (
      <Navigator>
        <Header>
          <View hidden />
          <AppHeader />
        </Header>

        <Switch>
          <Navigator>
            <Header>
              <View hidden />
              <MyHeader title="Login" />
              <View hidden />
            </Header>

            <Tabs>
              <Screen name="home">
                <SplashScreen />
              </Screen>

              <Screen name="login">
                <LoginScreen />
              </Screen>

              <Screen name="signup">
                {({ navigation }) => {
                  const navigateToMain = name => {
                    navigation.parent.navigate('main', { name })
                  }

                  return (
                    <Navigator navigation={navigation}>
                      <Header>
                        <SignupHeader />
                        <UsernameSignupHeader />
                        <View hidden />
                        <View hidden />
                      </Header>
                      <Stack>
                        <Screen>
                          <NameForm />
                        </Screen>
                        <Screen>
                          <UsernameSignupForm />
                        </Screen>

                        <Screen>
                          <SignupSuccessScreen />
                        </Screen>
                        <Navigator style={{ backgroundColor: 'white' }}>
                          <Tabs>
                            <Screen>
                              <MyScreen title="Some information" />
                            </Screen>
                            <Screen>
                              <MyScreen title="More info" />
                            </Screen>
                            <Screen>
                              <LastOnboardingScreen />
                            </Screen>
                          </Tabs>

                          <TabBar>
                            <Tab>
                              <TabIcon>One</TabIcon>
                            </Tab>
                            <Tab>
                              <TabIcon>Two</TabIcon>
                            </Tab>
                            <Tab>
                              <TabIcon>Three</TabIcon>
                            </Tab>
                          </TabBar>
                        </Navigator>

                        <Screen>
                          <OnboardingCompleteScreen
                            onSuccess={navigateToMain}
                          />
                        </Screen>
                      </Stack>
                    </Navigator>
                  )
                }}
              </Screen>
            </Tabs>
          </Navigator>
          <Screen name="main">
            <MainScreen />
          </Screen>
        </Switch>

        <Modal>
          <Screen>
            <VerifyModal />
          </Screen>
        </Modal>

        <Header>
          <View hidden />
          <AppHeader />
        </Header>
      </Navigator>
    )
  }
}

function AppHeader(props) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 3 }} />
      <View style={{ flex: 1 }}>
        <Button
          title="Logout"
          onPress={() => props.navigation.modal.select(0)}
        />
      </View>
    </View>
  )
}

function TabIcon(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        borderWidth: props.active ? StyleSheet.hairlineWidth : 0,
      }}
    >
      <Text
        style={[styles.subtitle, { color: props.active ? 'black' : 'gray' }]}
      >
        {props.children}
      </Text>
    </View>
  )
}

class NameForm extends React.Component {
  state = {
    name: '',
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Thanks for trying out our app</Text>
        <Text style={styles.subtitle}>Please fill in your name:</Text>
        <TextInput
          style={[styles.input, { textAlign: 'center' }]}
          placeholder="Name"
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        <Button
          title="Next"
          onPress={() =>
            this.props.navigation.push({
              name: this.state.name,
            })
          }
          disabled={!this.state.name}
        />
      </View>
    )
  }
}

function VerifyModal(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to logout? </Text>
      <Button title="Yes" onPress={() => props.navigation.reset()} />
      <Button title="No" onPress={() => props.navigation.modal.dismiss()} />
    </View>
  )
}

class UsernameSignupForm extends React.Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {`Hello ${this.props.navigation.state.name}!`}
        </Text>

        <Text style={styles.subtitle}>Email and password please:</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          title="Sign up"
          onPress={() =>
            this.props.navigation.push({
              email: this.state.email,
              password: this.state.password,
            })
          }
          disabled={!this.state.email || !this.state.password}
        />
      </View>
    )
  }
}

function UsernameSignupHeader(props) {
  return (
    <View style={styles.header}>
      <View style={{ position: 'absolute', left: 20 }}>
        <Button title="Go back" onPress={() => props.navigation.pop()} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{`${
          props.navigation.state.name
        }'s Signup`}</Text>
      </View>
    </View>
  )
}

function MainScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Hello ${props.navigation.state.name}`}</Text>
      <Button title="Logout" onPress={() => props.navigation.modal.select(0)} />
    </View>
  )
}

function LastOnboardingScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last onboarding screen!</Text>
      <Button title="Press me" onPress={() => props.navigation.parent.push()} />
    </View>
  )
}

function OnboardingCompleteScreen(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Complete!</Text>
      <Text
        style={styles.subtitle}
      >{`You're all set! Let's get you going`}</Text>
      <Button
        title="Take me to the app"
        onPress={() => props.onSuccess(props.navigation.state.name)}
      />
    </View>
  )
}

class SignupSuccessScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>
          {`Thanks so much for signing up ${this.props.navigation.state.name}!`}
        </Text>
        <Text style={styles.subtitle}>
          {`We will be contacting you at ${
            this.props.navigation.state.email
          } to verify your account`}
        </Text>
        <Text
          style={styles.subtitle}
        >{`But for now, we'd like to show you some stuff in the app`}</Text>
        <Button
          title="Take me to onboarding"
          onPress={() => this.props.navigation.push()}
        />
      </View>
    )
  }
}

class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the App!</Text>
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('login')}
        />
        <Button
          title="Sign up"
          onPress={() => this.props.navigation.navigate('signup')}
        />
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.container, { backgroundColor: 'white' }]}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to login:
          </Text>
        </View>
        <View style={{ flex: 2 }}>
          <TextInput
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
          />
          <Button
            title="Log me in"
            onPress={() =>
              this.props.navigation.parent.navigate('main', {
                name: this.state.email,
              })
            }
            disabled={!this.state.email || !this.state.password}
          />
        </View>
      </View>
    )
  }
}

function SignupHeader(props) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Button
          title="Go back"
          onPress={() => props.navigation.parent.select(0)}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Sign up</Text>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  )
}

class MyHeader extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          {this.props.activeIndex > 0 && (
            <Button
              title="Go back"
              onPress={() => this.props.navigation.pop()}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title]}>{this.props.title}</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    margin: 5,
  },

  paragraph: {
    fontSize: 14,
    margin: 5,
  },

  input: {
    fontSize: 14,
    margin: 20,
    width: 200,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default App
