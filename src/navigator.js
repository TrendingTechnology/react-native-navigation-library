import React from 'react'
import { View } from 'react-native'
import { cloneWithNavigation } from './lib'
import Transitioner from './transitioner'

const { Provider, Consumer } = React.createContext({})

class Navigator extends React.Component {
  selectActiveIndex = (index, data = {}) => {
    this.setState(
      state => {
        return {
          activeIndex: index,
          navigation: {
            ...state.navigation,
            state: {
              ...state.navigation.state,
              ...data,
            },
          },
        }
      },
      () => {
        if (this.props.onNavigationChange) {
          this.props.onNavigationChange({
            activeIndex: this.state.activeIndex,
            navigation: this.state.navigation,
          })
        }
      },
    )
  }

  toggleModal = (active, data = {}) => {
    this.setState(state => {
      return {
        navigation: {
          ...state.navigation,
          modal: {
            ...state.navigation.modal,
            active: active,
          },
          data: {
            ...state.navigation.state,
            ...data,
          },
        },
      }
    })
  }

  setScreens = screens => {
    this.setState({
      screens: screens.map((s, index) => s.props.name || index.toString()),
    })
  }

  push = data => {
    if (this.state.screens.length > this.state.activeIndex + 1) {
      this.selectActiveIndex(this.state.activeIndex + 1, data)
    }
  }

  pop = data => {
    if (this.state.activeIndex - 1 >= 0) {
      this.selectActiveIndex(this.state.activeIndex - 1, data)
    }
  }

  reset = () => {
    this.setState(this.initialState)
  }

  select = (index = 0, data) => {
    if (index >= 0) {
      this.selectActiveIndex(index, data)
    }
  }

  navigate = (routeName, data) => {
    const route = this.state.screens.indexOf(routeName)
    if (route !== -1) {
      this.selectActiveIndex(route, data)
    }
  }

  modal = {
    show: data => {
      this.toggleModal(true, data)
    },

    dismiss: data => {
      this.toggleModal(false, data)
    },
  }

  navigation = {
    push: this.push,
    pop: this.pop,
    reset: this.reset,
    select: this.select,
    modal: this.modal,
    navigate: this.navigate,
    parent: this.props.navigation,
    state: {},
  }

  initialState = {
    activeIndex: 0,
    navigation: this.navigation,
    setScreens: this.setScreens,
  }

  state = {
    ...this.initialState,
    screens: [],
  }

  componentDidMount() {
    if (this.props.onNavigationChange) {
      this.props.onNavigationChange({
        activeIndex: this.state.activeIndex,
        navigation: this.state.navigation,
      })
    }
  }

  render() {
    return (
      <Provider value={this.state}>
        <Transitioner activeIndex={this.state.activeIndex}>
          {this.props.children}
        </Transitioner>
      </Provider>
    )
  }
}

class NavigatorContainer extends React.Component {
  render() {
    const { style, ...rest } = this.props
    return (
      <View style={[{ flex: 1 }, style]}>
        <Navigator {...rest} />
      </View>
    )
  }
}

class NavigationScreens extends React.Component {
  constructor(props) {
    super(props)
    props.setScreens && props.setScreens(props.screens)
  }

  render() {
    return this.props.children
  }
}

function createNavigationContainer(NavigationComponent) {
  return class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            const { setScreens, ...rest } = context // eslint-disable-line
            return <NavigationComponent {...rest} {...this.props} />
          }}
        </Consumer>
      )
    }
  }
}

function createNavigationScreenContainer(NavigationComponent) {
  return class NavigationScreenContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            const { setScreens, ...rest } = context
            const children = React.Children.toArray(this.props.children)

            return (
              <NavigationScreens screens={children} setScreens={setScreens}>
                <NavigationComponent {...rest} {...this.props} />
              </NavigationScreens>
            )
          }}
        </Consumer>
      )
    }
  }
}

function createModalNavigationContainer(Component) {
  return class ModalNavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            const { activeIndex, navigation } = context
            return (
              <Component
                navigation={navigation}
                activeIndex={activeIndex}
                {...this.props}
              />
            )
          }}
        </Consumer>
      )
    }
  }
}

function createNavigationScreen(ScreenComponent) {
  return class NavigationScreen extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            const { children, ...rest } = this.props

            if (typeof this.props.children === 'function') {
              return (
                <ScreenComponent {...rest}>
                  {this.props.children({
                    navigation: context.navigation,
                  })}
                </ScreenComponent>
              )
            }

            return (
              <ScreenComponent {...rest}>
                {React.Children.map(children, child => {
                  return cloneWithNavigation(child, context, {})
                })}
              </ScreenComponent>
            )
          }}
        </Consumer>
      )
    }
  }
}

export {
  createNavigationContainer,
  createModalNavigationContainer,
  createNavigationScreen,
  createNavigationScreenContainer,
}
export default NavigatorContainer
