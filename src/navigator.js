import React from 'react'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext({})

import { Route } from 'react-router-native'

class Navigator extends React.Component {
  static defaultProps = {
    animated: true,
    screens: [],
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    screens: PropTypes.array.isRequired,
  }

  onNavigationChange = () => {
    if (this.props.onNavigationChange) {
      this.props.onNavigationChange({
        activeIndex: this.state.activeIndex,
        activeScreen: this.props.screens[this.state.activeIndex],
        navigation: this.state.navigation,
      })
    }
  }

  push = data => {
    const { activeIndex } = this.state
    const nextScreen = this.props.screens[activeIndex + 1]

    if (nextScreen) {
      this.props.history.push(`${this.props.basepath}/${nextScreen}`, data)
    }
  }

  pop = data => {
    const { activeIndex } = this.state
    const previousScreen = this.props.screens[activeIndex - 1]
    if (previousScreen) {
      this.props.history.push(`${this.props.basepath}/${previousScreen}`, data)
    }
  }

  navigate = (routeName, data) => {
    this.props.history.push(`${this.props.basepath}/${routeName}`, data)
  }

  goTo = (routeName, data) => {
    this.props.history.push(`${routeName}`, data)
  }

  replaceWith = (routeName, data) => {
    this.props.history.replace(`${routeName}`, data)
  }

  back = () => {
    if (this.props.history.index !== 0) {
      this.props.history.goBack()
    }
  }

  select = (index, data) => {
    const nextScreen = this.props.screens[index]
    if (nextScreen) {
      this.props.history.push(`${this.props.basepath}/${nextScreen}`, data)
    }
  }

  reset = () => {
    this.props.history.go(-this.state.updateCount)
    this.setState(this.initialState)
  }

  toggleModal = (name, data, active) => {
    const modal = this.state.modals.indexOf(name)

    if (modal !== -1) {
      this.setState(state => {
        return {
          navigation: {
            ...state.navigation,
            state: { ...state.navigation.state, ...data },
            modal: {
              ...state.navigation.modal,
              activeIndex: active ? modal : -1,
              active: active,
            },
          },
        }
      }, this.onNavigationChange)
    }
  }

  modal = {
    active: false,
    activeIndex: -1,

    show: (name, data) => {
      this.toggleModal(name, data, true)
    },

    dismiss: (name, data) => {
      this.toggleModal(name, data, false)
    },
  }

  getActiveIndex = () => {
    const { match, screens } = this.props
    let activeIndex = 0
    if (match) {
      activeIndex = screens.indexOf(match.params.activeScreen)
    }

    return activeIndex
  }

  initialState = {
    activeIndex: this.getActiveIndex(),
    navigation: {
      push: this.push,
      pop: this.pop,
      reset: this.reset,
      back: this.back,
      select: this.select,
      navigate: this.navigate,
      goTo: this.goTo,
      replaceWith: this.replaceWith,
      state: this.props.initialState || {},
      modal: this.modal,
    },
    basepath: this.props.basepath,
    name: this.props.name,
    animated: this.props.animated,
    modals: this.props.modals || [],
    updateCount: 0,
  }

  state = this.initialState

  setActiveIndex = data => {
    const activeIndex = this.getActiveIndex()

    this.setState(state => {
      return {
        activeIndex: activeIndex,
        navigation: {
          ...state.navigation,
          state: {
            ...state.navigation.state,
            ...data,
          },
        },
      }
    }, this.onNavigationChange)
  }

  componentDidMount() {
    // push the first route when pointed to a navigator
    if (this.props.root) {
      this.props.history.push(
        `${this.props.basepath}/${this.props.screens[0]}`,
        this.props.initialState
      )
    } else {
      this.setActiveIndex()
    }

    // update count used to get the correct index for reset()
    this.unlisten = this.props.history.listen(() => {
      this.setState(state => {
        return {
          updateCount: state.updateCount + 1,
        }
      })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.key !== this.props.location.key) {
      this.setActiveIndex(this.props.location.state)
    }
  }

  render() {
    const children = this.props.children
    return (
      <Provider value={this.state}>
        {typeof children === 'function'
          ? children(this.state)
          : React.cloneElement(children, this.state)}
      </Provider>
    )
  }
}

function withRouting(Component) {
  function NavigationRoute(props) {
    return (
      <Consumer>
        {context => {
          // we can inherit the base path from parent context if we're a nested navigator
          // this helps because we no longer need to pass down all props to a custom navigator component
          let path = ''

          if (context) {
            path = `${context.basepath || ''}/${props.name}`
          }

          if (props.basepath) {
            path = `${props.basepath || ''}/${props.name}`
          }

          return (
            <Route
              path={path}
              render={({ match }) => {
                // this is a convienience api
                // root component will push first screen when it mounts if its at a navigator
                // e.g linkTo: '/my-navigator' -> CDM -> history.push('/my-navigator/first-screen')
                const root = match.isExact
                return (
                  <Route
                    path={`${path}/:activeScreen`}
                    children={({ match, location, history }) => {
                      return (
                        <Component
                          {...props}
                          match={match}
                          history={history}
                          location={location}
                          initialState={location.state || props.initialState}
                          root={root}
                          basepath={path}
                        />
                      )
                    }}
                  />
                )
              }}
            />
          )
        }}
      </Consumer>
    )
  }

  NavigationRoute.displayName = `withRouting(${Component.displayName ||
    Component.name ||
    'Component'})`

  return NavigationRoute
}

function withNavigation(Component) {
  class NavigationContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return <Component {...this.props} {...context} />
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

function withModalNavigation(Component) {
  class ModalContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <Component
                {...this.props}
                navigation={context.navigation}
                activeIndex={context.navigation.modal.activeIndex}
                animated={context.animated}
              />
            )
          }}
        </Consumer>
      )
    }
  }

  ModalContainer.displayName = `withNavigation(${Component.displayName ||
    Component.name ||
    'Modal'})`

  return ModalContainer
}

export { Navigator, withNavigation, withModalNavigation }
export default withRouting(Navigator)
