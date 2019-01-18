import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Screen from './screen'

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rendered: [this.props.activeIndex],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState(state => {
        const previous = state.rendered.filter(
          i => i !== this.props.activeIndex,
        )
        return {
          rendered: [...previous, this.props.activeIndex],
        }
      })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {this.state.rendered.map(childIndex => {
          return (
            <Screen
              {...this.props}
              index={childIndex}
              key={childIndex}
              in={childIndex === this.props.activeIndex}
              optimized
            >
              {cloneWithNavigation(children[childIndex], this.props, {
                index: childIndex,
                in: childIndex === this.props.activeIndex,
                key: childIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export default createNavigationScreenContainer(Tabs)
