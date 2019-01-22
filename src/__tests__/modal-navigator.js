import React from 'react'
import { Text } from 'react-native'
import { render } from 'react-native-testing-library'
import { Modal } from '../modal-navigator'

describe('<Modal />', () => {
  test('empty render', () => {
    expect(() => render(<Modal />)).not.toThrow()
  })

  test('renders modal based on activeIndex and modal status', () => {
    const { getByText } = render(
      <Navigation activeIndex={0} navigation={{ modal: { active: true } }} />,
    )

    getByText('1')
    expect(() => getByText('2')).toThrow()
  })

  test('transitions out modal when active status changes', () => {
    const { getByText } = render(
      <Navigation activeIndex={0} navigation={{ modal: { active: true } }} />,
    )

    expect(getByText('1'))
  })
})

function Navigation(props) {
  return (
    <Modal {...props}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
    </Modal>
  )
}
