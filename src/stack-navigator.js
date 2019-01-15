import React from 'react'
import { View } from 'react-native'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

class Stack extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children).slice(
      0,
      Math.max(this.props.transitionIndex + 1, this.props.activeIndex + 1),
    )

    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          const _child = cloneWithNavigation(child, this.props)

          if (!_child) {
            return null
          }

          return (
            <Transition
              transitionOut={
                index > this.props.activeIndex &&
                this.props.transitionIndex > this.props.activeIndex
              }
              onTransitionEnd={this.props.onTransitionEnd}>
              {_child}
            </Transition>
          )
        })}
      </View>
    )
  }
}

export default createNavigationContainer(Stack)
