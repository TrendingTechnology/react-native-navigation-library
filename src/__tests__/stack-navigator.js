import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Stack } from '../stack-navigator'

describe('<Stack />', () => {
  test('empty render', () => {
    expect(() => render(<Stack />)).not.toThrow()
  })

  test('renders all children up to activeIndex', () => {
    const { getByText } = render(<Navigation activeIndex={1} />)

    getByText('1')
    getByText('2')
    expect(() => getByText('3')).toThrow()
  })

  test('children receive transitionioning prop based on activeIndex', () => {
    const { getByText, update } = render(<Navigation activeIndex={0} />)

    expect(getByText('1').props.transition.in).toBe(true)

    update(<Navigation activeIndex={1} />)

    expect(getByText('1').props.transition.in).toBe(true)
    expect(getByText('2').props.transition.in).toBe(true)
  })

  test('transitions child out', () => {
    const { getByText, update } = render(
      <Navigation activeIndex={0} transitioning={true} previousIndex={1} />,
    )

    expect(getByText('1').props.transition.in).toBe(true)
    expect(getByText('2').props.transition.in).toBe(false)

    expect(() => getByText('3')).toThrow()

    update(
      <Navigation activeIndex={0} transitioning={false} previousIndex={1} />,
    )
    expect(() => getByText('2')).toThrow()
  })

  test('transitions multiple children out', () => {
    const { getByText, update } = render(
      <Navigation activeIndex={0} transitioning={true} previousIndex={2} />,
    )

    expect(getByText('1').props.transition.in).toBe(true)
    expect(getByText('2').props.transition.in).toBe(false)
    expect(getByText('3').props.transition.in).toBe(false)

    update(
      <Navigation transitioning={false} activeIndex={0} previousIndex={2} />,
    )
    getByText('1')
    expect(() => getByText('2')).toThrow()
    expect(() => getByText('3')).toThrow()
  })

  test('children receive a transition.index prop corresponding to their index', () => {
    const { getByText } = render(<Navigation activeIndex={2} />)
    expect(getByText('1').props.transition.index).toEqual(0)
    expect(getByText('2').props.transition.index).toEqual(1)
    expect(getByText('3').props.transition.index).toEqual(2)
  })
})

function Navigation(props) {
  return (
    <Stack {...props}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Stack>
  )
}
