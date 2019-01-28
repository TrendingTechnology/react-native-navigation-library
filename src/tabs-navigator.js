import React from 'react'
import { View } from 'react-native'
import Screen from './screen'
import { withNavigation } from './navigator'

class Tabs extends React.Component {
  state = {
    rendered: [this.props.activeIndex],
    activeIndex: this.props.activeIndex,
    previousIndex: null,
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
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {this.state.rendered.map(childIndex => {
          const child = children[childIndex]

          if (!child) {
            return null
          }

          return (
            <Screen
              {...child.props}
              key={childIndex}
              animated={this.props.animated}
              index={childIndex}
              previousIndex={this.state.previousIndex}
              activeIndex={this.props.activeIndex}
              transition={{
                in: childIndex === this.props.activeIndex,
              }}
              optimized
            >
              {React.cloneElement(child, { navigation: this.props.navigation })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Tabs }
export default withNavigation(Tabs)
