import React from 'react'
import { View } from 'react-native'
import Screen from './screen'
import { withNavigation } from './navigator'

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: props.activeIndex,
      rendered: [props.activeIndex],
      transitioning: false,
    }

    props.updateScreens && props.updateScreens(props.children)
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

          const testIdPrefix = this.props.name ? this.props.name + '-' : ''

          const testingProps = {
            testID:
              childIndex === this.props.activeIndex
                ? `${testIdPrefix}active-screen`
                : `${testIdPrefix}inactive-screen-${childIndex}`,
          }

          const { style: childStyle, ...childProps } = child.props

          return (
            <Screen
              {...childProps}
              testingProps={testingProps}
              style={[this.props.screenStyle, childStyle]}
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
export default withNavigation(Tabs, 'screen-container')
