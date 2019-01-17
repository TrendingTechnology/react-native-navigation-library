import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Screen from './screen'

class Switch extends React.Component {
  state = {
    rendered: [this.props.activeIndex],
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState(state => {
        const previous = state.rendered.filter(
          i => i !== this.props.activeIndex,
        )
        return {
          rendered: [this.props.activeIndex, ...previous],
        }
      })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)
    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {[
          this.props.transitioning && this.props.previousIndex,
          this.props.activeIndex,
        ]
          .filter(i => i === 0 || Boolean(i))
          .map(childIndex => {
            const child = children[childIndex]

            return (
              <Screen
                {...this.props}
                key={childIndex}
                index={childIndex}
                in={this.props.activeIndex === childIndex}
                optimized
              >
                {cloneWithNavigation(child, this.props, {
                  index: childIndex,
                  in: this.props.activeIndex === childIndex,
                })}
              </Screen>
            )
          })}
      </View>
    )
  }
}

export default createNavigationScreenContainer(Switch)
