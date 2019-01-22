import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Switch } from '../switch-navigator'

describe('<Switch />', () => {
  test('empty render', () => {
    expect(() => render(<Switch />)).not.toThrow()
  })

  test('renders only one child at a time', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)
    getByText('2')
    expect(() => getByText('1')).toThrow()

    update(<Navigation activeIndex={0} />)
    getByText('1')
    expect(() => getByText('2')).toThrow()
  })

  test('children receive transitioning prop based on activeIndex', () => {
    const { getByText } = render(
      <Navigation activeIndex={1} transitioning previousIndex={0} />,
    )
    expect(getByText('1').props.transition.in).toBe(false)
    expect(getByText('2').props.transition.in).toBe(true)
  })

  test('children receive a transition.index prop corresponding to their index', () => {
    const { getByText, update } = render(<Navigation activeIndex={2} />)
    expect(getByText('3').props.transition.index).toEqual(2)

    update(<Navigation activeIndex={1} />)
    expect(getByText('2').props.transition.index).toEqual(1)

    update(<Navigation activeIndex={0} />)
    expect(getByText('1').props.transition.index).toEqual(0)
  })

  test('transitions from one screen to another', () => {
    const { getByText, update } = render(
      <Navigation activeIndex={0} transitioning previousIndex={1} />,
    )

    getByText('1')
    getByText('2')

    update(<Navigation transitioning={false} activeIndex={0} />)
    getByText('1')
    expect(() => getByText('2')).toThrow()
  })
})

function Navigation(props) {
  return (
    <Switch {...props}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Switch>
  )
}
