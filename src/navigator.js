import React from 'react'
import { View } from 'react-native'
import { cloneWithNavigation } from './lib'

const { Provider, Consumer } = React.createContext()

class Navigator extends React.Component {
  selectActiveIndex = (index, data = {}) => {
    this.setState(
      (state) => {
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
    this.setState((state) => {
      return {
        activeModalIndex: index,
        data: {
          ...state.data,
          ...data,
        },
      }
    })
  }

  push = (data) => {
    this.selectActiveIndex(this.state.activeIndex + 1, data)
  }

  pop = (data) => {
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
    push: (data) => {
      this.selectModalIndex(this.state.activeModalIndex + 1, data)
    },

    pop: (data) => {
      if (this.state.activeModalIndex >= 0) {
        this.selectModalIndex(this.state.activeModalIndex - 1, data)
      }
    },

    dismiss: (data) => {
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
    navigator: (navigation) => ({ navigation }),
  }

  render() {
    return (
      <Consumer>
        {(context) => {
          const api = this.props.navigator(context.navigation)
          const child = React.Children.only(
            cloneWithNavigation(this.props.children, this.props, {
              ...api,
              data: context.data,
            }),
          )

          return <View style={[{ flex: 1 }, this.props.style]}>{child}</View>
        }}
      </Consumer>
    )
  }
}

function createNavigationContainer(Component) {
  return class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {(context) => {
            return <Component {...context} {...this.props} />
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
          {(context) => {
            const { activeIndex, activeModalIndex, ...rest } = context // eslint-disable-line

            return (
              <Component
                {...rest}
                {...this.props}
                activeIndex={activeModalIndex}
              />
            )
          }}
        </Consumer>
      )
    }
  }
}

export { createNavigationContainer, createModalNavigationContainer, Screen }
export default Navigator
