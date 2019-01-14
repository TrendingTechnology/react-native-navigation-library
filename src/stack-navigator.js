import React from 'react'
import { View } from 'react-native'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

class Stack extends React.Component {
  state = {
    popIndex: -1,
    activeIndex: this.props.activeIndex,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      if (nextProps.activeIndex > prevState.activeIndex) {
        return {
          popIndex: prevState.activeIndex,
          activeIndx: nextProps.activeIndex,
        }
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({ popIndex: -1 })
  }

  render() {
    const popping = this.state.popIndex !== -1

    const cutoffIndex = popping
      ? this.state.popIndex + 1
      : this.props.activeIndex + 1

    const children = React.Children.toArray(this.props.children).slice(
      0,
      cutoffIndex,
    )

    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          return (
            <Transition
              transitionOut={popping && index > this.props.activeIndex}
              onTransitionEnd={this.handleTransitionEnd}>
              {cloneWithNavigation(child, this.props)}
            </Transition>
          )
        })}
      </View>
    )
  }
}

export default createNavigationContainer(Stack)
