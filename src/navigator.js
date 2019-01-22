import React from 'react'
import { View } from 'react-native'
import Transitioner, { TransitionContext } from './transitioner'

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
    if (this.state.screens[index]) {
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
    active: false,
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
    if (!this.props.children) {
      return null
    }

    return (
      <Provider value={this.state}>
        <Transitioner activeIndex={this.state.activeIndex}>
          {this.props.children({
            navigation: this.state.navigation,
          })}
        </Transitioner>
      </Provider>
    )
  }
}

function withNavigation(Component) {
  return class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <Component
                {...this.props}
                navigation={context.navigation}
                activeIndex={context.activeIndex}
              />
            )
          }}
        </Consumer>
      )
    }
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

function withScreenNavigation(Component) {
  return class ScreenContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <NavigationScreens
                setScreens={context.setScreens}
                screens={React.Children.toArray(this.props.children)}
              >
                <View style={this.props.style || { flex: 1 }}>
                  <TransitionContext>
                    {({ transitioning, previousIndex }) => {
                      return (
                        <Component
                          {...this.props}
                          transitioning={transitioning}
                          previousIndex={previousIndex}
                          navigation={context.navigation}
                          activeIndex={context.activeIndex}
                        />
                      )
                    }}
                  </TransitionContext>
                </View>
              </NavigationScreens>
            )
          }}
        </Consumer>
      )
    }
  }
}

export { withNavigation, withScreenNavigation, Consumer }

export default Navigator
