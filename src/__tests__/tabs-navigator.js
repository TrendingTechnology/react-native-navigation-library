import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Tabs } from '../tabs-navigator'

describe('<Tabs />', () => {
  test('empty render', () => {
    expect(() => render(<Tabs />)).not.toThrow()
  })

  test('renders the activeIndex', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)

    expect(getByText('2'))

    update(<Navigation activeIndex={0} />)

    expect(getByText('1'))
  })

  test('does not render a child that is not there', () => {
    expect(() => render(<Navigation activeIndex={1000} />)).not.toThrow()
  })

  test('children recieve transition prop based on activeIndex', () => {
    const { getByText, update } = render(<Navigation activeIndex={0} />)

    expect(getByText('1').props.transition).toBeTruthy()
    expect(getByText('1').props.transition.in).toBe(true)

    update(<Navigation activeIndex={1} />)

    expect(getByText('2').props.transition.in).toBe(true)
    expect(getByText('1').props.transition.in).toBe(false)
  })

  test('children receive a transition.index prop corresponding to their index', () => {
    const { getByText, update } = render(<Navigation activeIndex={2} />)
    update(<Navigation activeIndex={0} />)
    update(<Navigation activeIndex={1} />)

    expect(getByText('1').props.transition.index).toEqual(0)
    expect(getByText('2').props.transition.index).toEqual(1)
    expect(getByText('3').props.transition.index).toEqual(2)
  })

  test('children render in order of activeIndex and remain mounted', () => {
    const { getByText, update } = render(<Navigation activeIndex={1} />)

    expect(() => getByText('1')).toThrow()

    update(<Navigation activeIndex={0} />)

    getByText('2')
    getByText('1')
  })
})

function Navigation(props) {
  return (
    <Tabs activeIndex={props.activeIndex}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Tabs>
  )
}
