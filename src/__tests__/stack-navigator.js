import React from 'react'
import { View } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import { Stack, Navigator, Header } from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Stack />', () => {
  test('navigation.push(), navigation.pop() and navigation.reset()', () => {
    function App() {
      return (
        <Navigator>
          <Header>
            <View />
            <View />
            <NavigateComponent
              title="Reset"
              onPress={navigation => navigation.reset()}
            />
          </Header>
          <Stack>
            <NavigateComponent
              title="Push 1"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="Push 2"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="Pop"
              onPress={navigation => navigation.pop()}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    expect(() => getByText('Push 2')).toThrow()
    expect(() => getByText('Pop')).toThrow()

    fireEvent.press(getByText('Push 1'))
    fireEvent.press(getByText('Push 2'))
    fireEvent.press(getByText('Pop'))

    expect(() => getByText('Pop')).toThrow()

    fireEvent.press(getByText('Push 2'))
    fireEvent.press(getByText('Reset'))

    expect(() => getByText('Pop')).toThrow()
    expect(() => getByText('Push 2')).toThrow()
  })

  test('navigation.navigate()', () => {
    function App() {
      return (
        <Navigator>
          <Stack>
            <NavigateComponent
              title="first"
              name="first"
              onPress={navigation => navigation.navigate('third')}
            />
            <NavigateComponent
              title="second"
              name="second"
              onPress={navigation => navigation.navigate('first')}
            />
            <NavigateComponent
              title="third"
              name="third"
              onPress={navigation => navigation.navigate('second')}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first'))
    fireEvent.press(getByText('third'))
    fireEvent.press(getByText('second'))

    expect(() => getByText('second')).toThrow()
    expect(() => getByText('third')).toThrow()
  })

  test('navigation.select()', () => {
    function App() {
      return (
        <Navigator>
          <Stack>
            <NavigateComponent
              title="first"
              name="first"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="second"
              name="second"
              onPress={navigation => navigation.select(0)}
            />
            <NavigateComponent
              title="third"
              name="third"
              onPress={navigation => navigation.select(1)}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first'))
    fireEvent.press(getByText('third'))
    fireEvent.press(getByText('second'))

    expect(() => getByText('second')).toThrow()
    expect(() => getByText('third')).toThrow()
  })

  test('renders all relevant items in the stack', () => {
    function App() {
      return (
        <Navigator>
          <Stack>
            <NavigateComponent
              title="first"
              name="first"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="second"
              name="second"
              onPress={navigation => navigation.select(0)}
            />
            <NavigateComponent
              title="third"
              name="third"
              onPress={navigation => navigation.select(1)}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('first'))

    expect(() => getByText('third')).not.toThrow()
    expect(() => getByText('second')).not.toThrow()
    expect(() => getByText('first')).not.toThrow()

    fireEvent.press(getByText('third'))
    expect(() => getByText('third')).toThrow()
    expect(() => getByText('second')).not.toThrow()
    expect(() => getByText('first')).not.toThrow()

    fireEvent.press(getByText('second'))
    expect(() => getByText('third')).toThrow()
    expect(() => getByText('second')).toThrow()
    expect(() => getByText('first')).not.toThrow()
  })

  test('passing data w/ navigation fns', () => {
    function App() {
      return (
        <Navigator>
          <Stack>
            <NavigateComponent
              title="first"
              name="first"
              value="test"
              onPress={navigation =>
                navigation.select(2, { test: 'from-first' })
              }
            />
            <NavigateComponent
              title="second"
              name="second"
              value="test"
              onPress={navigation =>
                navigation.navigate('first', { test: 'from-second' })
              }
            />
            <NavigateComponent
              title="third"
              name="third"
              value="test"
              onPress={navigation => navigation.pop({ test: 'from-third' })}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText, getAllByText } = render(<App />)

    expect(() => getByText('from-first')).toThrow()
    fireEvent.press(getByText('first'))
    expect(() => getAllByText('from-first')).not.toThrow()

    fireEvent.press(getByText('third'))
    expect(() => getByText('from-first')).toThrow()
    expect(() => getAllByText('from-third')).not.toThrow()

    fireEvent.press(getByText('second'))
    expect(() => getAllByText('from-third')).toThrow()
    expect(() => getByText('from-second')).not.toThrow()
  })
})
