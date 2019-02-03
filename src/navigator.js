import React from 'react'
import { BackHandler } from 'react-native'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext({})

// type Props = {
//   animated: boolean,
//   initialIndex?: number,
//   initialState?: any,
//   screens?: [string],
//   navigation?: Navigation,
//   onNavigationChange: (navigation: CallbackArgs) => void,
//   children: any,
// }

// type Navigation = {
//   back: (data: any, callback: (navigation: CallbackArgs) => void) => void,
//   push: (data: any, callback: (navigation: CallbackArgs) => void) => void,
//   pop: (data: any, callback: (navigation: CallbackArgs) => void) => void,
//   reset: (callback: (navigation: CallbackArgs) => void) => void,
//   select: (
//     index: number,
//     data: any,
//     callback: (navigation: CallbackArgs) => void
//   ) => void,
//   modal: {
//     active: boolean,
//     dismiss: (data: any) => void,
//     show: (data: any) => void,
//   },
//   navigate: (
//     routeName: string,
//     data: any,
//     callback: (navigation: CallbackArgs) => void
//   ) => void,
//   parent?: Navigation,
//   state: any,
// }

// type CallbackArgs = {
//   activeIndex: number,
//   activeScreen: string,
//   navigation: Navigation,
// }

// type State = {
//   navigation: Navigation,
//   activeIndex: number,
//   previous: [number],
//   screens: [string],
//   updateScreens: (screens: [any]) => void,
//   animated: boolean,
// }

class Navigator extends React.Component {
  static defaultProps = {
    animated: true,
  }

  static propTypes = {
    animated: PropTypes.bool,
    initialIndex: PropTypes.number,
    initialState: PropTypes.object,
    navigation: PropTypes.object,
    onNavigationChange: PropTypes.func,
  }

  selectActiveIndex = (index, data = {}, callback) => {
    if (this.state.screens[index]) {
      this.setState(
        state => {
          return {
            activeIndex: index,
            previous: [...state.previous, state.activeIndex],
            navigation: this.updateNavigationState(state, data),
          }
        },
        () => {
          this.onNavigationChange()
          if (callback) {
            callback({
              activeIndex: this.state.activeIndex,
              activeScreen: this.state.screens[this.state.activeIndex],
              navigation: this.state.navigation,
            })
          }
        }
      )
    }
  }

  onNavigationChange = () => {
    if (this.props.onNavigationChange) {
      this.props.onNavigationChange({
        activeIndex: this.state.activeIndex,
        activeScreen: this.state.screens[this.state.activeIndex],
        navigation: this.state.navigation,
      })
    }
  }

  updateNavigationState = (state, data) => {
    return {
      ...state.navigation,
      state: {
        ...state.navigation.state,
        ...data,
      },
    }
  }

  toggleModal = (active, data = {}) => {
    this.setState(state => {
      return {
        navigation: {
          ...this.updateNavigationState(state, data),
          modal: {
            ...state.navigation.modal,
            active: active,
          },
        },
      }
    }, this.onNavigationChange)
  }

  updateScreens = children => {
    if (this.state.screens.length === 0) {
      this.setState({
        screens: React.Children.toArray(children).map(
          (child, index) => child.props.name || `${index}`
        ),
      })
    }
  }

  back = data => {
    if (this.state.previous.length > 0) {
      const prevIndex = this.state.previous[this.state.previous.length - 1]

      if (this.state.screens[prevIndex]) {
        this.setState(state => {
          return {
            activeIndex: prevIndex,
            previous: state.previous.slice(0, state.previous.length - 1),
            navigation: this.updateNavigationState(state, data),
          }
        })
      }
    }
  }

  push = (data, callback) => {
    this.selectActiveIndex(this.state.activeIndex + 1, data, callback)
  }

  pop = (data, callback) => {
    this.selectActiveIndex(this.state.activeIndex - 1, data, callback)
  }

  select = (index = 0, data, callback) => {
    this.selectActiveIndex(index, data, callback)
  }

  navigate = (routeName, data, callback) => {
    const route = this.state.screens.indexOf(routeName)
    if (route !== -1) {
      this.selectActiveIndex(route, data, callback)
    }
  }

  reset = callback => {
    this.setState(this.initialState, () => {
      if (callback) {
        callback({
          activeIndex: this.state.activeIndex,
          activeScreen: this.state.screens[this.state.activeIndex],
          navigation: this.state.navigation,
        })
      }
    })
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
    back: this.back,
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
    previous: [],
  }

  state = {
    ...this.initialState,
    screens: this.props.screens || [],
    updateScreens: this.updateScreens,
    animated: this.props.animated,
  }

  handleBackPress = () => {
    // TODO -- can use focused and navigation prop to recursively pop views
    this.state.navigation.back()
    return true
  }

  componentDidMount() {
    if (this.props.onNavigationChange) {
      this.props.onNavigationChange({
        activeIndex: this.state.activeIndex,
        activeScreen: this.state.screens[this.state.activeIndex],
        navigation: this.state.navigation,
      })
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
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
                animated={context.animated}
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
      props.updateScreens &&
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
                  previous={context.previous}
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
