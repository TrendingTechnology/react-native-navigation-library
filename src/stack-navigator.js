import React from 'react'
import { View } from 'react-native'
import { withScreenNavigation } from './navigator'
import Screen from './screen'

class Stack extends React.Component {
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
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.state.transitioning
        ? Math.max(this.state.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1
    )

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          const focused = index === this.props.activeIndex

          const testIdPrefix = this.props.name ? this.props.name + '-' : ''

          const testingProps = {
            testID: focused
              ? `${testIdPrefix}active-screen`
              : `${testIdPrefix}inactive-screen-${index}`,
          }

          const { style: screenStyle, ...childProps } = child.props

          return (
            <Screen
              {...childProps}
              testingProps={testingProps}
              style={[this.props.screenStyle, screenStyle]}
              animated={this.props.animated}
              index={index}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              transition={{
                in: index <= this.props.activeIndex,
                onTransitionEnd: this.handleTransitionEnd,
                transitioning: this.state.transitioning,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: index === this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Stack }
export default withScreenNavigation(Stack)
