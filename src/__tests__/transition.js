import React from 'react'
import { Animated, View } from 'react-native'
import { render } from 'react-native-testing-library'
import Transition from '../transition'

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

  test('animation config as a prop', () => {
    const fakeAnimationConfig = {
      test: 'me',
      toValue: 1,
    }

    render(<Transition animationConfig={fakeAnimationConfig} in />)
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      fakeAnimationConfig,
    )
  })
})
