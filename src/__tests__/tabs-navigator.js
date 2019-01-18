import React from 'react'
import { View, Text } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import {
  Navigator,
  Header,
  TabBar,
  Tabs,
  Tab,
} from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Tabs />', () => {
  test('navigation.push(), navigation.pop(), and navigation.reset()', () => {
    function App() {
      return (
        <Navigator>
          <Header>
            <View />
            <NavigateComponent
              title="reset"
              onPress={navigation => navigation.reset()}
            />
            <View />
          </Header>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="second-tab"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="third-tab"
              onPress={navigation => navigation.pop()}
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    getByText('first-tab-active')
    expect(() => getByText('second-tab')).toThrow()
    expect(() => getByText('third-tab')).toThrow()

    fireEvent.press(getByText('first-tab'))
    getByText('first-tab-inactive')
    getByText('second-tab-active')
    expect(() => getByText('third-tab')).toThrow()

    fireEvent.press(getByText('second-tab'))
    getByText('second-tab-inactive')
    getByText('third-tab-active')

    fireEvent.press(getByText('third-tab'))
    getByText('third-tab-inactive')
    getByText('first-tab-inactive')
    getByText('second-tab-active')

    fireEvent.press(getByText('reset'))
    getByText('first-tab-active')
    getByText('second-tab-inactive')
    getByText('third-tab-inactive')
  })

  test('navigation.navigate()', () => {
    function App() {
      return (
        <Navigator>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              name="first"
              onPress={navigation => navigation.navigate('third')}
            />
            <NavigateComponent
              title="second-tab"
              name="second"
              onPress={navigation => navigation.navigate('first')}
            />
            <NavigateComponent
              title="third-tab"
              name="third"
              onPress={navigation => navigation.navigate('second')}
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first-tab'))
    getByText('third-tab-active')

    fireEvent.press(getByText('third-tab'))
    getByText('second-tab-active')
    getByText('third-tab-inactive')

    fireEvent.press(getByText('second-tab'))
    getByText('first-tab-active')
    getByText('second-tab-inactive')
  })

  test('navigation.select()', () => {
    function App() {
      return (
        <Navigator>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              name="first"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="second-tab"
              name="second"
              onPress={navigation => navigation.select(0)}
            />
            <NavigateComponent
              title="third-tab"
              name="third"
              onPress={navigation => navigation.select(1)}
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first-tab'))
    getByText('third-tab-active')

    fireEvent.press(getByText('third-tab'))
    getByText('second-tab-active')
    getByText('third-tab-inactive')

    fireEvent.press(getByText('second-tab'))
    getByText('first-tab-active')
    getByText('second-tab-inactive')
  })

  test('only renders the views that have been selected', () => {
    function App() {
      return (
        <Navigator>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              name="first"
              onPress={navigation => navigation.select(3)}
            />
            <NavigateComponent
              title="second-tab"
              name="second"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="third-tab"
              name="third"
              onPress={navigation => navigation.select(0)}
            />
            <NavigateComponent
              title="fourth-tab"
              name="fourth"
              onPress={navigation => navigation.select(1)}
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first-tab'))
    getByText('fourth-tab-active')
    expect(() => getByText('second-tab')).toThrow()
    expect(() => getByText('third-tab')).toThrow()

    fireEvent.press(getByText('fourth-tab'))
    getByText('second-tab-active')
    expect(() => getByText('third-tab')).toThrow()

    fireEvent.press(getByText('second-tab'))

    // all four are now mounted but only third should be active
    getByText('third-tab-active')
    getByText('first-tab-inactive')
    getByText('second-tab-inactive')
    getByText('fourth-tab-inactive')
  })

  test('tab bar is mapped to tabs', () => {
    function App() {
      return (
        <Navigator>
          <TabBar>
            <Tab>
              <Text>{`first`}</Text>
            </Tab>
            <Tab>
              <Text>{`second`}</Text>
            </Tab>
            <Tab>
              <Text>{`third`}</Text>
            </Tab>
          </TabBar>
          <Tabs>
            <NavigateComponent title="first-screen" onPress={() => {}} />
            <NavigateComponent title="second-screen" onPress={() => {}} />
            <NavigateComponent title="third-screen" onPress={() => {}} />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)
    fireEvent.press(getByText('second'))
    getByText('first-screen-inactive')
    getByText('second-screen-active')

    fireEvent.press(getByText('third'))
    getByText('second-screen-inactive')
    getByText('third-screen-active')

    fireEvent.press(getByText('first'))
    getByText('third-screen-inactive')
    getByText('first-screen-active')

    fireEvent.press(getByText('third'))
    getByText('first-screen-inactive')
    getByText('third-screen-active')

    fireEvent.press(getByText('second'))
    getByText('third-screen-inactive')
    getByText('second-screen-active')
  })

  // not sure if it should be the other way around for tabs yet
  test('push() and pop() are mapped to tab index, not order of rendering', () => {
    function App() {
      return (
        <Navigator>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              name="first"
              onPress={navigation => navigation.select(3)}
            />
            <NavigateComponent
              title="second-tab"
              name="second"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="third-tab"
              name="third"
              onPress={navigation => navigation.pop()}
            />
            <NavigateComponent
              title="fourth-tab"
              name="fourth"
              onPress={navigation => navigation.pop()}
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first-tab'))
    fireEvent.press(getByText('fourth-tab'))
    fireEvent.press(getByText('third-tab'))
    fireEvent.press(getByText('second-tab'))

    getByText('second-tab-inactive')
    getByText('third-tab-active')
  })

  test('passing data w/ navigation fns', () => {
    function App() {
      return (
        <Navigator>
          <Tabs>
            <NavigateComponent
              title="first-tab"
              name="first"
              value="first"
              onPress={navigation => navigation.push({ second: 'from-first' })}
            />
            <NavigateComponent
              title="second-tab"
              value="second"
              onPress={navigation =>
                navigation.select(2, { third: 'from-second' })
              }
            />
            <NavigateComponent
              title="third-tab"
              name="third"
              value="third"
              onPress={navigation =>
                navigation.navigate('fourth', { fourth: 'from-third' })
              }
            />
            <NavigateComponent
              title="fourth-tab"
              name="fourth"
              value="fourth"
              onPress={navigation =>
                navigation.navigate('first', { first: 'from-fourth' })
              }
            />
          </Tabs>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    expect(() => getByText('from-first')).toThrow()
    fireEvent.press(getByText('first-tab'))
    getByText('from-first')

    expect(() => getByText('from-second')).toThrow()
    fireEvent.press(getByText('second-tab'))
    getByText('from-second')

    expect(() => getByText('from-third')).toThrow()
    fireEvent.press(getByText('third-tab'))
    getByText('from-third')

    expect(() => getByText('from-fourth')).toThrow()
    fireEvent.press(getByText('fourth-tab'))
    getByText('from-fourth')
  })
})
