import React from 'react'
import { Animated, View } from 'react-native'
import { render } from 'react-native-testing-library'
import { Transition } from '../transition'

jest.mock('Animated', () => {
  return {
    View: props => <View>{props.children}</View>,
    Value: jest.fn(() => {
      return {
        interpolate: jest.fn(),
      }
    }),
    timing: jest.fn(() => {
      return {
        start: jest.fn(),
      }
    }),
  }
})

describe('<Transition />', () => {
  test('empty render', () => {
    expect(() => render(<Transition />)).not.toThrow()
  })

  test('animation transform as prop', () => {
    const animation = jest.fn()
    render(<Transition animationTransform={animation} />)
    expect(animation).toHaveBeenCalledTimes(1)
  })

  test('animates when `in` prop changes', () => {
    const { update } = render(<Transition />)
    expect(Animated.timing).toHaveBeenCalledTimes(0)

    update(<Transition in />)
    expect(Animated.timing).toHaveBeenCalledTimes(1)

    update(<Transition in={false} />)
    expect(Animated.timing).toHaveBeenCalledTimes(2)
  })

  test('indices determine animation values', () => {
    const anim = {
      interpolate: jest.fn(),
    }

    render(
      <Transition in index={1} activeIndex={1} previousIndex={0} anim={anim} />,
    )

    expect(anim.interpolate).toHaveBeenCalledTimes(1)
    expect(anim.interpolate.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "extrapolate": "clamp",
  "inputRange": Array [
    0,
    1,
  ],
  "outputRange": Array [
    750,
    0,
  ],
}
`)

    render(
      <Transition in index={0} activeIndex={0} previousIndex={1} anim={anim} />,
    )
    expect(anim.interpolate).toHaveBeenCalledTimes(2)
    expect(anim.interpolate.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "extrapolate": "clamp",
  "inputRange": Array [
    0,
    1,
  ],
  "outputRange": Array [
    -750,
    0,
  ],
}
`)

    render(<Transition in index={1} activeIndex={0} anim={anim} />)
    expect(anim.interpolate).toHaveBeenCalledTimes(3)
    expect(anim.interpolate.mock.calls[2][0]).toMatchInlineSnapshot(`
Object {
  "extrapolate": "clamp",
  "inputRange": Array [
    0,
    1,
  ],
  "outputRange": Array [
    750,
    0,
  ],
}
`)

    render(<Transition in index={1} activeIndex={2} anim={anim} />)
    expect(anim.interpolate).toHaveBeenCalledTimes(4)
    expect(anim.interpolate.mock.calls[3][0]).toMatchInlineSnapshot(`
Object {
  "extrapolate": "clamp",
  "inputRange": Array [
    0,
    1,
  ],
  "outputRange": Array [
    -750,
    0,
  ],
}
`)
  })
})
