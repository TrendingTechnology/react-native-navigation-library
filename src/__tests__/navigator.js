import React from 'react'
import { Button, View } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import Navigator from '../navigator'

describe('<Navigator />', () => {
  test('empty render', () => {
    expect(() => render(<Navigator />)).not.toThrow()
  })

  test('passes navigation in render prop', () => {
    const spy = jest.fn(() => null)

    render(<Navigator children={spy} screens={['test']} />)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      activeScreen: 'test',
      screens: ['test'],
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
  "activeScreen": "test",
  "navigation": Object {
    "modal": Object {
      "active": false,
      "dismiss": [Function],
      "show": [Function],
    },
    "navigate": [Function],
    "parent": undefined,
    "pop": [Function],
    "push": [Function],
    "reset": [Function],
    "select": [Function],
    "state": Object {},
  },
  "screens": Array [
    "test",
  ],
}
`)
  })

  test('onNavigationChange fires when navigation is updated', () => {
    const spy = jest.fn()
    render(<Navigator onNavigationChange={spy} screens={['test2']} />)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      activeScreen: 'test2',
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
  "activeScreen": "test2",
  "navigation": Object {
    "modal": Object {
      "active": false,
      "dismiss": [Function],
      "show": [Function],
    },
    "navigate": [Function],
    "parent": undefined,
    "pop": [Function],
    "push": [Function],
    "reset": [Function],
    "select": [Function],
    "state": Object {},
  },
}
`)
  })

  test('navigation functions', () => {
    function NavigationFunctions(props) {
      return (
        <Navigator {...props} screens={['push', 'select', 'navigate', 'pop']}>
          {({ navigation }) => {
            return (
              <View>
                <Button title="push" onPress={() => navigation.push()} />
                <Button title="select" onPress={() => navigation.select(2)} />
                <Button
                  title="navigate"
                  onPress={() => navigation.navigate('pop')}
                />
                <Button title="pop" onPress={() => navigation.pop()} />
              </View>
            )
          }}
        </Navigator>
      )
    }

    const onUpdate = jest.fn()

    const { getByText } = render(
      <NavigationFunctions onNavigationChange={onUpdate} />,
    )

    fireEvent.press(getByText('push'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 1,
      activeScreen: 'select',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('select'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      activeScreen: 'navigate',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('navigate'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 3,
      activeScreen: 'pop',
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('pop'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      activeScreen: 'navigate',
      navigation: expect.any(Object),
    })
  })
})
