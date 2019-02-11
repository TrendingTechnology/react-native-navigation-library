import React from 'react'
import { Button, Text } from 'react-native'
import Navigator from '../navigator'
import Switch from '../switch-navigator'
import Tabs from '../tabs-navigator'
import { render, fireEvent } from 'react-native-testing-library'
import { NativeRouter as Router, Link } from 'react-router-native'

function App(props) {
  return (
    <Router initialEntries={['/test/test-1']}>
      <Navigator name="test" {...props}>
        <Switch>
          <MyButton
            name="test-1"
            onPress={navigation => navigation.push({ test: 'value' })}
          />
          <MyButton
            name="test-2"
            onPress={navigation =>
              navigation.navigate('test-3', { test2: 'value-2' })
            }
          />
          <MyButton name="test-3" onPress={navigation => navigation.reset()} />

          <Navigator name="inner-navigator">
            <Tabs>
              <MyButton
                name="inner-1"
                onPress={navigation => navigation.push()}
              />
              <MyButton
                name="inner-2"
                onPress={navigation => navigation.push()}
              />
              <MyButton
                name="inner-3"
                onPress={navigation => navigation.pop()}
              />
            </Tabs>
          </Navigator>
        </Switch>
        <Link to="/test/inner-navigator/inner-3">
          <Text>go to inner</Text>
        </Link>
      </Navigator>
    </Router>
  )
}

test('render', () => {
  const { getByText } = render(<App />)

  fireEvent.press(getByText('test-1'))
  fireEvent.press(getByText('go to inner'))

  getByText('inner-3')
})

function MyButton(props) {
  return (
    <Button
      title={props.name}
      onPress={() => props.onPress(props.navigation)}
    />
  )
}
