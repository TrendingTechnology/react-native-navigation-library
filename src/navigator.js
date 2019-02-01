import React from 'react'

const { Provider, Consumer } = React.createContext({})

class Navigator extends React.Component {
  static defaultProps = {
    animated: true,
  }

  selectActiveIndex = (index, data = {}) => {
    if (this.state.screens[index]) {
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
              activeScreen: this.state.screens[this.state.activeIndex],
              navigation: this.state.navigation,
            })
          }
        },
      )
    }
  }

  toggleModal = (active, data = {}) => {
    this.setState(
      state => {
        return {
          navigation: {
            ...state.navigation,
            modal: {
              ...state.navigation.modal,
              active: active,
            },
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
            activeScreen: this.state.screens[this.state.activeIndex],
            navigation: this.state.navigation,
          })
        }
      },
    )
  }

  updateScreens = children => {
    if (this.state.screens.length === 0) {
      this.setState({
        screens: React.Children.toArray(children).map(
          (child, index) => child.props.name || `${index}`,
        ),
      })
    }
  }

  push = data => {
    this.selectActiveIndex(this.state.activeIndex + 1, data)
  }

  pop = data => {
    this.selectActiveIndex(this.state.activeIndex - 1, data)
  }

  select = (index = 0, data) => {
    this.selectActiveIndex(index, data)
  }

  navigate = (routeName, data) => {
    const route = this.state.screens.indexOf(routeName)
    if (route !== -1) {
      this.selectActiveIndex(route, data)
    }
  }

  reset = () => {
    this.setState(this.initialState)
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
    state: this.props.initialState || {},
  }

  initialState = {
    activeIndex: this.props.initialIndex || 0,
    navigation: this.navigation,
  }

  state = {
    ...this.initialState,
    screens: this.props.screens || [],
    updateScreens: this.updateScreens,
    animated: this.props.animated,
  }

  componentDidMount() {
    if (this.props.onNavigationChange) {
      this.props.onNavigationChange({
        activeIndex: this.state.activeIndex,
        activeScreen: this.state.screens[this.state.activeIndex],
        navigation: this.state.navigation,
      })
    }
  }

  render() {
    if (typeof this.props.children === 'function') {
      return (
        <Provider value={this.state}>
          {this.props.children({
            navigation: this.state.navigation,
            activeIndex: this.state.activeIndex,
            activeScreen: this.state.screens[this.state.activeIndex],
          })}
        </Provider>
      )
    }

    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

function withNavigation(Component) {
  class NavigationContainer extends React.Component {
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

  NavigationContainer.displayName = `withNavigation(${Component.displayName ||
    Component.name ||
    'Component'})`

  return NavigationContainer
}

function withScreenNavigation(Component) {
  class RegisterScreens extends React.Component {
    constructor(props) {
      super(props)
      props.updateScreens(React.Children.toArray(props.screens))
    }

    render() {
      return this.props.children
    }
  }
  class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <RegisterScreens
                updateScreens={context.updateScreens}
                screens={this.props.children}
              >
                <Component
                  {...this.props}
                  navigation={context.navigation}
                  activeIndex={context.activeIndex}
                  animated={context.animated}
                />
              </RegisterScreens>
            )
          }}
        </Consumer>
      )
    }
  }

  NavigationContainer.displayName = `withNavigation(${Component.displayName ||
    Component.name ||
    'Component'})`

  return NavigationContainer
}

export { withNavigation, withScreenNavigation }
export default Navigator
