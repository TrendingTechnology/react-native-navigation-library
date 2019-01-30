import React from 'react'
import { View } from 'react-native'
import { withNavigation } from './navigator'
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
        : this.props.activeIndex + 1,
    )

    return (
      <View style={[{ flex: 1, overflow: 'hidden' }, this.props.style]}>
        {React.Children.map(children, (child, index) => {
          const testingProps = {
            testID:
              index === this.props.activeIndex
                ? `active-screen`
                : `inactive-screen-${index}`,
          }

          return (
            <Screen
              {...testingProps}
              {...child.props}
              animated={this.props.animated}
              index={index}
              activeIndex={this.props.activeIndex}
              previousIndex={this.state.previousIndex}
              transition={{
                in: index <= this.props.activeIndex,
                onTransitionEnd: this.handleTransitionEnd,
              }}
            >
              {React.cloneElement(child, { navigation: this.props.navigation })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Stack }
export default withNavigation(Stack)
