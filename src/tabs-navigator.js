import React from 'react'
import { View } from 'react-native'
import { createNavigationScreenContainer } from './navigator'
import { cloneWithNavigation } from './lib'

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

    return this.state.rendered.map(childIndex => {
      return cloneWithNavigation(children[childIndex], this.props, {
        index: childIndex,
        in: childIndex === this.props.activeIndex,
        key: childIndex
      })
    })
  }
}

class TabsNavigator extends React.Component {
  render() {
    const { style, ...rest } = this.props
    return (
      <View style={[{ flex: 1 }, style]}>
        <Tabs {...rest} />
      </View>
    )
  }
}

export default createNavigationScreenContainer(TabsNavigator)
