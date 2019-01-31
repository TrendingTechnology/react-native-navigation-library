import React from 'react'
import { View, Text, Button } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import {
  Navigator,
  Stack,
  Switch,
  Header,
  Tabs,
  TabBar,
  Tab,
} from '../../react-native-navigation-library'

test('stack navigation', () => {
  function StackApp() {
    return (
      <Navigator initialState={{ hello: '123' }}>
        {({ navigation, activeIndex }) => {
          return (
            <View style={{ flex: 1 }}>
              <Header>
                <Button title="Header 1" onPress={() => navigation.reset()} />
                <Button title="Header 2" onPress={() => navigation.pop()} />
                <Button title="Header 3" onPress={() => navigation.pop()} />
              </Header>

              <Stack name="stack">
                <View name="screen-1">
                  <Button
                    title="Screen 1"
                    onPress={() => navigation.push({ hello: 'joe' })}
                  />
                  {activeIndex === 0 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>

                <View name="screen-2">
                  <Button
                    title="Screen 2"
                    onPress={() => navigation.push({ hello: 'hi' })}
                  />
                  {activeIndex === 1 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>

                <View name="screen-3">
                  <Button
                    title="Screen 3"
                    onPress={() => navigation.pop({ hello: 'hey' })}
                  />

                  {activeIndex === 2 && (
                    <Text>{`hello ${navigation.state.hello}`}</Text>
                  )}
                </View>
              </Stack>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText, getByTestId } = render(<StackApp />)
  getByText('hello 123')
  fireEvent.press(getByText('Screen 1'))
  getByText('hello joe')
  fireEvent.press(getByText('Screen 2'))
  getByText('hello hi')
  fireEvent.press(getByText('Screen 3'))
  getByText('hello hey')
  fireEvent.press(getByText('Header 2'))
  getByText('hello hey')
  fireEvent.press(getByText('Header 1'))
  getByText('hello 123')

  fireEvent.press(getByText('Screen 1'))
  expect(getByTestId('stack-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Screen 2'))
  expect(getByTestId('stack-active-screen').props.name).toEqual('screen-3')

  fireEvent.press(getByText('Screen 3'))
  expect(getByTestId('stack-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Header 2'))
  expect(getByTestId('stack-active-screen').props.name).toEqual('screen-1')
})

test('tabs navigation', () => {
  function TabsApp() {
    return (
      <Navigator>
        {({ navigation }) => {
          return (
            <View style={{ flex: 1 }}>
              <Tabs name="tabs">
                <View name="screen-1">
                  <Button title="Screen 1" onPress={() => navigation.push()} />
                </View>
                <View name="screen-2">
                  <Button title="Screen 2" onPress={() => navigation.push()} />
                </View>
                <View name="screen-3">
                  <Button title="Screen 3" onPress={() => navigation.pop()} />
                </View>
              </Tabs>

              <TabBar>
                <Tab>
                  <Text>Tab 1</Text>
                </Tab>
                <Tab>
                  <Text>Tab 2</Text>
                </Tab>
                <Tab>
                  <Text>Tab 3</Text>
                </Tab>
              </TabBar>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText, getByTestId } = render(<TabsApp />)

  fireEvent.press(getByText('Tab 1'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-1')

  fireEvent.press(getByText('Tab 2'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Tab 3'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-3')

  fireEvent.press(getByText('Tab 1'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-1')

  fireEvent.press(getByText('Tab 2'))
  fireEvent.press(getByText('Screen 2'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-3')

  fireEvent.press(getByText('Tab 1'))
  fireEvent.press(getByText('Screen 1'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Tab 3'))
  fireEvent.press(getByText('Screen 3'))
  expect(getByTestId('tabs-active-screen').props.name).toEqual('screen-2')
})

test('switch navigator', () => {
  function SwitchApp() {
    return (
      <Navigator>
        {({ navigation }) => {
          return (
            <View style={{ flex: 1 }}>
              <Header>
                <View hidden />
                <Button title="Header 2" onPress={() => navigation.pop()} />
              </Header>
              <Switch name="switch">
                <View name="screen-1">
                  <Button title="Screen 1" onPress={() => navigation.push()} />
                </View>
                <View name="screen-2">
                  <Button title="Screen 2" onPress={() => navigation.push()} />
                </View>
                <View name="screen-3">
                  <Button title="Screen 3" onPress={() => navigation.pop()} />
                </View>
              </Switch>
            </View>
          )
        }}
      </Navigator>
    )
  }

  const { getByText, getByTestId } = render(<SwitchApp />)

  expect(() => getByText('Screen 2')).toThrow()

  fireEvent.press(getByText('Screen 1'))
  expect(() => getByText('Screen 1')).toThrow()
  expect(getByTestId('switch-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Screen 2'))
  expect(() => getByText('Screen 2')).toThrow()
  expect(getByTestId('switch-active-screen').props.name).toEqual('screen-3')

  fireEvent.press(getByText('Screen 3'))
  expect(() => getByText('Screen 3')).toThrow()
  expect(getByTestId('switch-active-screen').props.name).toEqual('screen-2')

  fireEvent.press(getByText('Header 2'))
  expect(() => getByText('Screen 2')).toThrow()
  expect(getByTestId('switch-active-screen').props.name).toEqual('screen-1')
})
