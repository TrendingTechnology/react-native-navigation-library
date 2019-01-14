import React from 'react'
import { View, Text, Button } from 'react-native'
import {
  Navigator,
  Tabs,
  TabBar,
  Header as TabHeader,
  Tab,
  Screen as NavScreen,
} from 'react-native-navigation-library'
import { Screen, Header, Tab as TabButton } from './shared'

class BasicTabs extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Text style={{ fontSize: 20, textAlign: 'center' }}>
            {this.props.title || 'Basic Tabs'}
          </Text>
        </Header>
        <Navigator>
          <Tabs>
            <NavScreen
              navigator={(navigation) => {
                console.log({ navigation })
                return {
                  navigateToNextScreen: navigation.push,
                }
              }}>
              <PushScreen
                title="Screens can push views...:"
                button="navigation.push"
              />
            </NavScreen>

            <TabPanel
              title="...and pop views:"
              button="navigation.pop"
              onPress={(navigation) => navigation.pop()}
            />

            <TabPanel
              title="You can reset to the initial tab...:"
              button="navigation.reset"
              onPress={(navigation) => navigation.reset()}
            />
            <TabPanel
              title="...or specify the index to push/pop to:"
              button="navigation.select"
              onPress={(navigation) => navigation.select(1)}
            />
          </Tabs>

          <TabBar>
            <Tab>
              <TabButton>
                <Text>First</Text>
              </TabButton>
            </Tab>
            <Tab>
              <TabButton>
                <Text>Second</Text>
              </TabButton>
            </Tab>
            <Tab>
              <TabButton>
                <Text>Third</Text>
              </TabButton>
            </Tab>
            <Tab>
              <TabButton>
                <Text>Fourth</Text>
              </TabButton>
            </Tab>
          </TabBar>
        </Navigator>
      </View>
    )
  }
}

class NestedTabs extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Text style={{ fontSize: 16 }}>
            You can position the tab bar where you like:
          </Text>
        </Header>
        <Navigator>
          <TabBar>
            <Tab>
              <TabButton>
                <Text>Pretty</Text>
              </TabButton>
            </Tab>
            <Tab>
              <TabButton>
                <Text>Pretty</Text>
              </TabButton>
            </Tab>
            <Tab>
              <TabButton>
                <Text>Cool</Text>
              </TabButton>
            </Tab>
          </TabBar>
          <Tabs>
            <BasicTabs title="Remember these?" />
            <BasicTabs title="Tabs are composable..." />
            <BasicTabs title="...and you control where and how they render!" />
          </Tabs>
        </Navigator>
      </View>
    )
  }
}

class TabsWithHeaders extends React.Component {
  render() {
    return (
      <Navigator>
        <TabHeader>
          <Header />
          <Header>
            <Text>Header here!</Text>
          </Header>
        </TabHeader>
        <Tabs>
          <TabPanel
            title="Tab bars are optional"
            button="Go to next"
            onPress={(navigation) => navigation.push()}
          />
          <TabPanel
            title="and you can even have Tabs with headers!"
            button="Go to next"
            onPress={(navigation) => navigation.push()}
          />
          <TabPanel
            title="...or leave it out if it should be hidden"
            button="Reset"
            onPress={(navigation) => navigation.reset()}
          />
        </Tabs>
      </Navigator>
    )
  }
}

class TabsWithHeadersAndTabBar extends React.Component {
  render() {
    return (
      <Navigator>
        <TabHeader>
          <Header>
            <Text>Putting it all together</Text>
          </Header>
          <Header>
            <Text>Super composable and declarative</Text>
          </Header>
        </TabHeader>

        <Tabs>
          <TabPanel
            title="If this has peaked your interest..."
            button="Go to next"
            onPress={(navigation) => navigation.push()}
          />

          <TabPanel
            title="Examples can be found in /Example/tabs"
            button="Reset"
            onPress={(navigation) => navigation.reset()}
          />
        </Tabs>

        <TabBar>
          <Tab>
            <TabButton>
              <Text>Hello</Text>
            </TabButton>
          </Tab>
          <Tab>
            <TabButton>
              <Text>Joe</Text>
            </TabButton>
          </Tab>
        </TabBar>
      </Navigator>
    )
  }
}

function TabPanel(props) {
  return (
    <Screen>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{props.title}</Text>
      <Button
        title={props.button}
        onPress={() => props.onPress(props.navigation)}
      />
    </Screen>
  )
}

function PushScreen(props) {
  return (
    <TabPanel onPress={() => props.navigateToNextScreen()} {...props} />
  )
}

export { BasicTabs, NestedTabs, TabsWithHeaders, TabsWithHeadersAndTabBar }
