import React from 'react'
import { View, Button, Text } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import { Header, Navigator, Stack } from 'react-native-navigation-library'
import { NavigateComponent } from 'test-utils'

describe('<Header />', () => {
  test('visible and hidden states', () => {
    function Wrapper(props) {
      return (
        <Header activeIndex={0} hidden={props.hidden}>
          <Text>MyHeader</Text>
        </Header>
      )
    }
    const { getByText, update } = render(<Wrapper />)

    getByText('MyHeader')

    update(<Wrapper hidden />)

    expect(() => getByText('MyHeader')).toThrow()
  })

  test('only renders the active child', () => {
    function MyHeader(props) {
      return (
        <View>
          <Text>{props.title}</Text>
        </View>
      )
    }

    function Wrapper(props) {
      return (
        <Header activeIndex={props.activeIndex}>
          <MyHeader title="one" />
          <MyHeader title="two" />
          <MyHeader title="three" />
        </Header>
      )
    }

    const { getByText, update } = render(<Wrapper activeIndex={2} />)

    expect(() => getByText('one')).toThrow()
    expect(() => getByText('two')).toThrow()
    getByText('three')

    update(<Wrapper activeIndex={1} />)
    expect(() => getByText('one')).toThrow()
    expect(() => getByText('three')).toThrow()
    getByText('two')

    update(<Wrapper activeIndex={0} />)
    expect(() => getByText('two')).toThrow()
    expect(() => getByText('three')).toThrow()
    getByText('one')
  })

  test('passes navigation prop and activeIndex to children', () => {
    function MyHeader(props) {
      return (
        <Button
          title="MyHeader"
          onPress={() => props.navigation.test(props.activeIndex)}
        />
      )
    }

    const fakeNavigation = {
      test: jest.fn(),
    }
    const { getByText } = render(
      <Header activeIndex={1} navigation={fakeNavigation}>
        <View />
        <MyHeader />
      </Header>,
    )

    expect(fakeNavigation.test).toHaveBeenCalledTimes(0)
    fireEvent.press(getByText('MyHeader'))

    expect(fakeNavigation.test).toHaveBeenCalledTimes(1)
    expect(fakeNavigation.test).toHaveBeenCalledWith(1)
  })

  test('children can hide the header', () => {
    function MyHeader(props) {
      return (
        <View>
          <Text>{props.title}</Text>
        </View>
      )
    }

    function Wrapper(props) {
      return (
        <Header activeIndex={props.activeIndex}>
          <MyHeader title="one" />
          <MyHeader title="two" hidden />
          <MyHeader title="three" />
        </Header>
      )
    }

    const { getByText, update } = render(<Wrapper activeIndex={0} />)
    getByText('one')

    update(<Wrapper activeIndex={1} />)
    expect(() => getByText('one')).toThrow()
    expect(() => getByText('two')).toThrow()
    expect(() => getByText('three')).toThrow()

    update(<Wrapper activeIndex={2} />)
    getByText('three')
    expect(() => getByText('one')).toThrow()
    expect(() => getByText('two')).toThrow()
  })

  test('header views are mapped to active navigation screen', () => {
    function App() {
      return (
        <Navigator>
          <Header>
            <Text>Header 1</Text>
            <Text>Header 2</Text>
            <Text>Header 3</Text>
          </Header>
          <Stack>
            <NavigateComponent
              title="one"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="two"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="three"
              onPress={navigation => navigation.pop()}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)

    getByText('Header 1')

    fireEvent.press(getByText('one'))
    getByText('Header 2')

    fireEvent.press(getByText('two'))
    getByText('Header 3')

    fireEvent.press(getByText('three'))
    getByText('Header 2')
  })

  test('null child is hidden for relative screen', () => {
    function App() {
      return (
        <Navigator>
          <Header testID="header">
            <Text>Header 1</Text>
          </Header>
          <Stack>
            <NavigateComponent
              title="one"
              onPress={navigation => navigation.push()}
            />
            <NavigateComponent
              title="two"
              onPress={navigation => navigation.push()}
            />
          </Stack>
        </Navigator>
      )
    }

    const { getByText } = render(<App />)
    getByText('Header 1')
    fireEvent.press(getByText('one'))

    expect(() => getByText('Header 1')).toThrow()
  })

  test('header can be styled', () => {
    function Wrapper() {
      return (
        <Header
          activeIndex={0}
          style={{ position: 'absolute', backgroundColor: 'green' }}
        >
          <Text>hi</Text>
        </Header>
      )
    }

    const { toJSON } = render(<Wrapper />)
    expect(toJSON()).toMatchInlineSnapshot(`
<View
  style={
    Array [
      Object {
        "borderBottomColor": "#A7A7AA",
        "borderBottomWidth": 0.5,
        "height": 64,
        "paddingTop": 20,
      },
      Object {
        "backgroundColor": "green",
        "position": "absolute",
      },
    ]
  }
>
  <Text
    activeIndex={0}
  >
    hi
  </Text>
</View>
`)
  })
})
