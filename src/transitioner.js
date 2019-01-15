import React from 'react'

class Transitioner extends React.Component {
  state = {
    previousIndex: -1,
    activeIndex: this.props.activeIndex,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        previousIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
      }
    }

    return null
  }

  reset = () => {
    this.setState({ previousIndex: -1 })
  }

  render() {
    return React.Children.only(
      React.cloneElement(this.props.children, {
        transitionIndex: this.state.previousIndex,
        onTransitionEnd: this.reset
      }),
    )
  }
}

export default Transitioner
