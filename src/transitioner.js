import React from 'react'

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

function withTransitioner(TransitionComponent) {
  return class TransitionContainer extends React.Component {
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
}

export { withTransitioner, Consumer as TransitionContext }
export default Transitioner
