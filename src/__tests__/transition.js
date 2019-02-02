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
    spring: jest.fn(() => {
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
    render(<Transition animation={animation} />)
    expect(animation).toHaveBeenCalledTimes(1)
  })

  test('animates when `in` prop changes', () => {
    const { update } = render(<Transition />)
    expect(Animated.spring).toHaveBeenCalledTimes(0)

    update(<Transition in />)
    expect(Animated.spring).toHaveBeenCalledTimes(1)

    update(<Transition in={false} />)
    expect(Animated.spring).toHaveBeenCalledTimes(2)
  })

  test('animation config as a prop', () => {
    const fakeAnimationConfig = {
      test: 'me',
      toValue: 1,
    }

    render(<Transition config={fakeAnimationConfig} in />)
    expect(Animated.spring).toHaveBeenCalledWith(expect.any(Object), {
      ...fakeAnimationConfig,
      useNativeDriver: true,
    })
  })
})
