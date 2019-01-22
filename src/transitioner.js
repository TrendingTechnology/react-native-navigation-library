import React from 'react'
import { getDisplayName } from './lib'

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
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

function withTransitions(TransitionComponent) {
  class TransitionContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
      // only update screens that are about to become active / visible
      // use opt-in optimized flag to let us animate views in between these value - e.g a stack animation
      if (this.props.optimized) {
        return (
          nextProps.activeIndex === this.props.index ||
          nextProps.previousIndex === this.props.index
        )
      }

      return true
    }

    render() {
      return (
        <Consumer>
          {context => {
            return (
              <TransitionComponent
                {...this.props}
                previousIndex={context.previousIndex}
                onTransitionEnd={context.onTransitionEnd}
              >
                {this.props.children}
              </TransitionComponent>
            )
          }}
        </Consumer>
      )
    }
  }

  TransitionContainer.displayName = `withTransitions(${getDisplayName(
    TransitionComponent,
  )})`

  return TransitionContainer
}

export { withTransitions, Consumer as TransitionContext }
export default Transitioner
