import React from 'react'
import { View } from 'react-native'
import { withNavigation } from './navigator'
import Screen from './screen'

class Switch extends React.Component {
  state = {
    activeIndex: this.props.activeIndex,
    previousIndex: null,
    transitioning: false,
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        previousIndex: prevState.activeIndex,
        activeIndex: nextProps.activeIndex,
        transitioning: nextProps.animated,
      }
    }

    return null
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const arr = React.Children.toArray(this.props.children)

    const children = []

    if (this.state.transitioning) {
      children.push(this.state.previousIndex)
    }

    children.push(this.props.activeIndex)

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {children.map(childIndex => {
          const child = arr[childIndex]

          if (!child) {
            return null
          }

          return (
            <Screen
              {...child.props}
              key={childIndex}
              animated={this.props.animated}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              index={childIndex}
              transition={{
                in: this.props.activeIndex === childIndex,
                onTransitionEnd: this.handleTransitionEnd,
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

export { Switch }
export default withNavigation(Switch)
