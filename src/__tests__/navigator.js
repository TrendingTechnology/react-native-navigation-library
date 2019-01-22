import React from 'react'
import { render } from 'react-native-testing-library'
import { Navigator } from 'react-native-navigation-library'

describe('<Navigator />', () => {
  test('empty render', () => {
    expect(() => render(<Navigator />)).not.toThrow()
  })

  test('passes navigation in render prop', () => {
    const spy = jest.fn(() => null)

    render(<Navigator children={spy} />)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({
      navigation: expect.any(Object),
    })

    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
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
})
