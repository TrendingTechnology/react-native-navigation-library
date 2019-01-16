import React from 'react'
import { View } from 'react-native'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import { TransitionContainer } from './transitioner'

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

        return (
          <TransitionContainer
            key={childIndex}
            in={this.props.activeIndex === childIndex}
          >
            {cloneWithNavigation(child, this.props, { index: childIndex })}
          </TransitionContainer>
        )
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

export default createNavigationContainer(SwitchNavigator)
