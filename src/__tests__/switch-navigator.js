import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Navigator, Switch } from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Switch />', () => {
  test('navigation.push(), navigation.pop(), and navigation.reset()', () => {
    function App() {
      return (
        <Navigator>
          <Switch>
            <NavigateComponent
              title="one"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="two"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="three"
              onPress={navigation => navigation.pop()}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('one'))
    fireEvent.press(getByText('two'))
    fireEvent.press(getByText('three'))
    fireEvent.press(getByText('two'))
  })

  test('navigation.navigate()', () => {
    function App() {
      return (
        <Navigator>
          <Switch>
            <NavigateComponent
              title="one"
              name="one"
              onPress={navigation => navigation.navigate('two')}
            />
            <NavigateComponent
              title="two"
              name="two"
              onPress={navigation => navigation.navigate('three')}
            />
            <NavigateComponent
              title="three"
              name="three"
              onPress={navigation => navigation.navigate('one')}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('one'))
    fireEvent.press(getByText('two'))
    fireEvent.press(getByText('three'))
    fireEvent.press(getByText('one'))
  })

  test('navigation.select()', () => {
    function App() {
      return (
        <Navigator>
          <Switch>
            <NavigateComponent
              title="one"
              name="one"
              onPress={navigation => navigation.select(1)}
            />
            <NavigateComponent
              title="two"
              name="two"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="three"
              name="three"
              onPress={navigation => navigation.select(0)}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('one'))
    fireEvent.press(getByText('two'))
    fireEvent.press(getByText('three'))
    fireEvent.press(getByText('one'))
  })

  test('it only renders one screen at a time', () => {
    function App() {
      return (
        <Navigator>
          <Switch>
            <NavigateComponent
              title="one"
              name="one"
              onPress={navigation => navigation.select(1)}
            />
            <NavigateComponent
              title="two"
              name="two"
              onPress={navigation => navigation.select(2)}
            />
            <NavigateComponent
              title="three"
              name="three"
              onPress={navigation => navigation.select(0)}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    expect(() => getByText('two')).toThrow()
    expect(() => getByText('three')).toThrow()

    fireEvent.press(getByText('one'))
    expect(() => getByText('one')).toThrow()

    fireEvent.press(getByText('two'))
    expect(() => getByText('two')).toThrow()

    fireEvent.press(getByText('three'))
    expect(() => getByText('three')).toThrow()

    getByText('one')
  })

  test('passing data w/ navigation fns', () => {
    function App() {
      return (
        <Navigator>
          <Switch>
            <NavigateComponent
              title="one"
              name="one"
              value="one"
              onPress={navigation => navigation.select(1, { two: 'from one' })}
            />
            <NavigateComponent
              title="two"
              name="two"
              value="two"
              onPress={navigation =>
                navigation.select(2, { three: 'from two' })
              }
            />
            <NavigateComponent
              title="three"
              name="three"
              value="three"
              onPress={navigation =>
                navigation.select(0, { one: 'from three' })
              }
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('one'))
    getByText('from one')

    fireEvent.press(getByText('two'))
    expect(() => getByText('from one')).toThrow()
    getByText('from two')

    fireEvent.press(getByText('three'))
    expect(() => getByText('from two')).toThrow()
    getByText('from three')
  })
})
