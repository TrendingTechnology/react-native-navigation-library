import React from 'react'
import Transition from './transition'

const { Consumer, Provider } = React.createContext({})

class Transitioner extends React.Component {
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        previousIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
        transitioning: true,
      }
    }

    return null
  }

  onTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  state = {
    previousIndex: -1,
    activeIndex: this.props.activeIndex,
    transitioning: false,
    onTransitionEnd: this.onTransitionEnd,
  }

  render() {
    return (
      <Provider value={this.state}>
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {
            transitioning: this.state.transitioning,
            previousIndex: this.state.previousIndex,
          })
        })}
      </Provider>
    )
  }
}

function createTransitionContainer(Component) {
  return class TransitionContainer extends React.Component {
    render() {
      return (
        <Consumer>
          {context => {
            return (
              <Component
                {...this.props}
                onTransitionEnd={context.onTransitionEnd}
              >
                {this.props.children}
              </Component>
            )
          }}
        </Consumer>
      )
    }
  }
}

class TransitionContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {context => {
          return (
            <Transition
              {...this.props}
              onTransitionEnd={context.onTransitionEnd}
            >
              {this.props.children}
            </Transition>
          )
        }}
      </Consumer>
    )
  }
}

export { TransitionContainer, createTransitionContainer }
export default Transitioner
