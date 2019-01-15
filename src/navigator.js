import React from 'react'
import { View, StyleSheet } from 'react-native'
import { cloneWithNavigation } from './lib'
import Transitioner from './transitioner'

const { Provider, Consumer } = React.createContext({})

class Navigator extends React.Component {
  selectActiveIndex = (index, data = {}) => {
    this.setState(
      state => {
        return {
          activeIndex: index,
          data: {
            ...state.data,
            ...data,
          },
        }
      },
      () => {
        if (this.props.onNavigationChange) {
          this.props.onNavigationChange(this.state.activeIndex)
        }
      },
    )
  }

  selectModalIndex = (index, data = {}) => {
    this.setState(state => {
      return {
        activeModalIndex: index,
        data: {
          ...state.data,
          ...data,
        },
      }
    })
  }

  setScreens = screens => {
    this.setState({ screens: screens.map(s => s.props.name) })
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
      this.selectModalIndex(
        this.state.activeModalIndex + this.state.activeIndex + 1,
        data,
      )
    },

    dismiss: data => {
      this.selectModalIndex(-1, data)
    },

    select: (index, data) => {
      this.selectModalIndex(index, data)
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
  }

  initialState = {
    data: {},
    activeIndex: 0,
    activeModalIndex: -1,
    navigation: this.navigation,
    setScreens: this.setScreens,
  }

  state = {
    ...this.initialState,
    screens: [],
  }

  render() {
    return (
      <Provider value={this.state}>
        <View style={[{ flex: 1 }, this.props.style]}>
          {this.props.children}
        </View>
      </Provider>
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

function createNavigationContainer(Component) {
  return class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            const { setScreens, ...rest } = context
            return (
              <NavigationScreens
                screens={this.props.children}
                setScreens={setScreens}
              >
                <Transitioner activeIndex={context.activeIndex}>
                  <Component {...rest} {...this.props} />
                </Transitioner>
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
            const { activeModalIndex, ...rest } = context

            return (
              <Transitioner activeIndex={context.activeModalIndex}>
                <Component
                  {...rest}
                  {...this.props}
                  activeIndex={activeModalIndex}
                />
              </Transitioner>
            )
          }}
        </Consumer>
      )
    }
  }
}

class Screen extends React.Component {
  static defaultProps = {
    navigator: navigation => {
      return {
        navigation,
      }
    },
  }

  render() {
    return (
      <Consumer>
        {context => {
          // provide the ability to define an api for children with the navigation prop
          const api = this.props.navigator(context.navigation)

          if (typeof this.props.children === 'function') {
            return this.props.children({ ...context, ...api })
          }

          const children = React.Children.map(this.props.children, child => {
            return cloneWithNavigation(child, this.props, {
              data: context.data,
              ...api,
            })
          })

          return (
            <View style={[styles.screen, this.props.style]}>{children}</View>
          )
        }}
      </Consumer>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})

export { createNavigationContainer, createModalNavigationContainer, Screen }
export default Navigator
