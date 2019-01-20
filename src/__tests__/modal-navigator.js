import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Modal, Switch, Navigator } from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Modal />', () => {
  test('navigation.show() and navigation.dismiss()', () => {
    function App() {
      return (
        <Navigator>
          <Modal>
            <NavigateComponent
              title="modal-1"
              onPress={navigation => navigation.modal.dismiss()}
            />
          </Modal>

          <Switch>
            <NavigateComponent
              title="screen-1"
              onPress={navigation => navigation.modal.show()}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('screen-1'))
    fireEvent.press(getByText('modal-1'))
  })

  test('modals are mapped to relative screens', () => {
    function App() {
      return (
        <Navigator>
          <Modal>
            <NavigateComponent
              title="modal-1"
              onPress={navigation => navigation.modal.dismiss()}
            />
          </Modal>

          <Switch>
            <NavigateComponent
              title="screen-1"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="screen-2"
              onPress={navigation => navigation.modal.show()}
            />
          </Switch>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    fireEvent.press(getByText('screen-1'))
    fireEvent.press(getByText('screen-2'))
    expect(() => getByText('modal-1')).toThrow()
  })
})
