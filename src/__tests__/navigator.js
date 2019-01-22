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

    render(<Navigator children={spy} />)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
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

  test('onNavigationChange fires when navigation is updated', () => {
    const spy = jest.fn()
    render(<Navigator onNavigationChange={spy} />)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
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
                <Button
                  name="push"
                  title="push"
                  onPress={() => navigation.push()}
                />
                <Button
                  name="select"
                  title="select"
                  onPress={() => navigation.select(2)}
                />
                <Button
                  name="navigate"
                  title="navigate"
                  onPress={() => navigation.navigate('pop')}
                />
                <Button
                  title="pop"
                  name="pop"
                  onPress={() => navigation.pop()}
                />
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
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('select'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('navigate'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 3,
      navigation: expect.any(Object),
    })

    fireEvent.press(getByText('pop'))
    expect(onUpdate).toHaveBeenLastCalledWith({
      activeIndex: 2,
      navigation: expect.any(Object),
    })
  })

  test('navigation functions handle invalid arguments', () => {
    const onUpdate = jest.fn()

    const { getByText, update } = render(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.push()}
      />,
    )

    onUpdate.mockReset()

    fireEvent.press(getByText('button'))
    expect(onUpdate).toHaveBeenCalledTimes(0)

    update(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.pop()}
      />,
    )
    fireEvent.press(getByText('button'))
    expect(onUpdate).toHaveBeenCalledTimes(0)

    update(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.select(123)}
      />,
    )
    fireEvent.press(getByText('button'))
    expect(onUpdate).toHaveBeenCalledTimes(0)

    update(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.navigate('hello joe')}
      />,
    )
    fireEvent.press(getByText('button'))
    expect(onUpdate).toHaveBeenCalledTimes(0)
  })

  test('navigation modal functions', () => {
    const onUpdate = jest.fn()
    const { getByText, update } = render(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.modal.show()}
      />,
    )

    onUpdate.mockReset()

    fireEvent.press(getByText('button'))
    expect(onUpdate.mock.calls[0][0].navigation.modal.active).toBe(true)

    update(
      <Navigation
        onNavigationChange={onUpdate}
        onPress={navigation => navigation.modal.dismiss()}
      />,
    )
    fireEvent.press(getByText('button'))
    expect(onUpdate.mock.calls[1][0].navigation.modal.active).toBe(false)
  })
})

function Navigation(props) {
  return (
    <Navigator {...props}>
      {({ navigation }) => {
        return (
          <Button title="button" onPress={() => props.onPress(navigation)} />
        )
      }}
    </Navigator>
  )
}
