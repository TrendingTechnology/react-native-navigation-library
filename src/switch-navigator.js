import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'

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

    return [
      this.props.transitioning && this.props.previousIndex,
      this.props.activeIndex,
    ]
      .filter(i => i === 0 || Boolean(i))
      .map(childIndex => {
        const child = children[childIndex]

        return cloneWithNavigation(child, this.props, {
          index: childIndex,
          in: this.props.activeIndex === childIndex,
        })
      })
  }
}

class SwitchNavigator extends React.Component {
  render() {
    const { style, ...rest } = this.props
    return (
      <View style={[{ flex: 1 }, style]}>
        <Switch {...rest} />
      </View>
    )
  }
}

export default createNavigationScreenContainer(SwitchNavigator)
