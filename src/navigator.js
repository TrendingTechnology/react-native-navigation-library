import React from 'react'
import { View, StyleSheet } from 'react-native'
import { cloneWithNavigation } from './lib'
import Transitioner from './transitioner'

const { Provider, Consumer } = React.createContext()

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

  push = data => {
    this.selectActiveIndex(this.state.activeIndex + 1, data)
  }

  pop = data => {
    if (this.state.activeIndex >= 0) {
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
    parent: this.props.navigation,
  }

  initialState = {
    data: {},
    activeIndex: 0,
    activeModalIndex: -1,
    navigation: this.navigation,
  }

  state = this.initialState

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
          // provide the ability to override context navigation -- in case we want custom
          // navigation functions i.e Router.navigate()
          const api = this.props.navigator(
            this.props.navigation ? this.props.navigation : context.navigation,
          )

          const children = React.Children.map(this.props.children, child => {
            const { children, navigation, data, ...rest } = this.props // eslint-disable-line

            return cloneWithNavigation(child, this.props, {
              data: context.data,
              ...api,
              ...rest,
            })
          })

          return <View style={[styles.card, this.props.style]}>{children}</View>
        }}
      </Consumer>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
})

function createNavigationContainer(Component) {
  return class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <Transitioner activeIndex={context.activeIndex}>
                <Component {...context} {...this.props} />
              </Transitioner>
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
            const { activeIndex, activeModalIndex, ...rest } = context // eslint-disable-line

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

export { createNavigationContainer, createModalNavigationContainer, Screen }
export default Navigator
