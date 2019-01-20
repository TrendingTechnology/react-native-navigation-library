import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Navigator, Stack } from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Navigator />', () => {
  test('onNavigationChange() fires on mount', () => {
    const spy = jest.fn()
    render(<Navigator onNavigationChange={spy} />)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 0,
      navigation: expect.any(Object),
    })
  })

  test('onNavigationChange() fires when navigation changes', () => {
    const { getByText, spy } = renderNavigator([
      { title: 'update', onPress: n => n.push() },
      { title: 'hello', onPress: n => n.pop() },
    ])

    fireEvent.press(getByText('update'))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      activeIndex: 1,
      navigation: expect.any(Object),
    })
  })

  test('push() does not fire if there is no child to push to', () => {
    const { spy, getByText } = renderNavigator([
      { title: 'update', onPress: n => n.push() },
      { title: 'hello', onPress: n => n.push() },
    ])

    fireEvent.press(getByText('update'))

    spy.mockReset()
    fireEvent.press(getByText('hello'))
    expect(spy).toHaveBeenCalledTimes(0)
  })

  test('pop() does not fire if there is no child to pop to', () => {
    const { getByText, spy } = renderNavigator([
      { title: 'update', onPress: n => n.pop() },
    ])

    fireEvent.press(getByText('update'))
    expect(spy).toHaveBeenCalledTimes(0)
  })

  test('navigate() does not fire if there is no child found', () => {
    const { getByText, spy } = renderNavigator([
      { title: 'update', onPress: n => n.navigate('some screen') },
    ])

    fireEvent.press(getByText('update'))
    expect(spy).toHaveBeenCalledTimes(0)
  })

  test('select() does not fire if there is no child found', () => {
    const { getByText, spy } = renderNavigator([
      { title: 'update', onPress: n => n.select(100) },
    ])

    fireEvent.press(getByText('update'))
    expect(spy).toHaveBeenCalledTimes(0)
  })
})

function renderNavigator(buttons) {
  const handleNavigationChange = jest.fn()

  function App(props) {
    return (
      <Navigator onNavigationChange={props.handleNavigationChange}>
        <Stack>
          {buttons.map((button, index) => {
            return (
              <NavigateComponent
                key={index}
                title={button.title}
                onPress={button.onPress}
              />
            )
          })}
        </Stack>
      </Navigator>
    )
  }

  const utils = render(<App handleNavigationChange={handleNavigationChange} />)

  // clears onMount call for tests
  handleNavigationChange.mockReset()

  return {
    ...utils,
    spy: handleNavigationChange,
  }
}
