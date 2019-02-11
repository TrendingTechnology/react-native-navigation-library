import React from 'react'
import { render } from 'react-native-testing-library'
import { Navigator } from '../navigator'

const fakeHistory = {
  listen: jest.fn(() => fakeHistory.unlisten),
  push: jest.fn(),
  unlisten: jest.fn(),
}

const fakeLocation = {
  key: '123',
}

describe('<Navigator />', () => {
  test('empty render', () => {
    expect(() => renderNavigator()).not.toThrow()
  })

  test('pushes initial child when navigated to the root', () => {
    renderNavigator({
      root: true,
      screens: ['1', '2'],
    })

    expect(fakeHistory.push.mock.calls[0][0]).toEqual('/1')
  })

  test('pushing to a child path', () => {
    const { renderFn } = renderNavigator({
      screens: ['1', '2'],
      match: { params: { activeScreen: '2' } },
    })

    expect(renderFn.mock.calls[0][0].activeIndex).toEqual(1)
  })

  test('removes listener on unmount', () => {
    const { unmount } = renderNavigator()
    unmount()
    expect(fakeHistory.unlisten).toHaveBeenCalled()
  })

  test('updates when the location changes', () => {
    const renderFn = jest.fn(() => null)
    const changeFn = jest.fn()

    function NavigatorComponent(props) {
      return (
        <Navigator
          name="123"
          basepath=""
          screens={['1', '2']}
          location={fakeLocation}
          history={fakeHistory}
          children={renderFn}
          onNavigationChange={changeFn}
          {...props}
        />
      )
    }

    const { update } = render(<NavigatorComponent />)

    changeFn.mockReset()

    update(
      <NavigatorComponent
        location={{ key: '321' }}
        match={{ params: { activeScreen: '2' } }}
      />
    )

    expect(changeFn).toHaveBeenCalledTimes(1)

    expect(
      renderFn.mock.calls[renderFn.mock.calls.length - 1][0].activeIndex
    ).toEqual(1)
  })

  test('navigation fns api', () => {
    const { renderFn } = renderNavigator()

    expect(renderFn.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "activeIndex": 0,
  "animated": true,
  "basepath": "",
  "modals": Array [],
  "name": "123",
  "navigation": Object {
    "back": [Function],
    "goTo": [Function],
    "modal": Object {
      "active": false,
      "activeIndex": -1,
      "dismiss": [Function],
      "show": [Function],
    },
    "navigate": [Function],
    "pop": [Function],
    "push": [Function],
    "replaceWith": [Function],
    "reset": [Function],
    "select": [Function],
    "state": Object {},
  },
  "updateCount": 0,
}
`)
  })
})

function renderNavigator(props) {
  const renderFn = jest.fn(() => null)

  function NavigatorComponent() {
    return (
      <Navigator
        name="123"
        basepath=""
        location={fakeLocation}
        history={fakeHistory}
        children={renderFn}
        {...props}
      />
    )
  }

  const utils = render(<NavigatorComponent />)

  return {
    ...utils,
    renderFn,
    NavigatorComponent,
  }
}
