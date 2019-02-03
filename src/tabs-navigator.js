import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes } from 'react-native'
import Screen from './screen'
import { withScreenNavigation } from './navigator'
import { slideInOut } from './animations'

// type Props = {
//   activeIndex: number,
//   children: any,
//   style: any,
//   screenStyle: any,
//   animated: boolean,
//   transition: {
//     config: any,
//     configIn: any,
//     configOut: any,
//     animation: animatedValue => any,
//     onTransitionEnd: () => void,
//   },
//   navigation: Navigation,
// }
// type State = {
//   activeIndex: number,
//   previousIndex?: number,
// }

class Tabs extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    activeIndex: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    screenStyle: ViewPropTypes.style,
    animated: PropTypes.bool,
    transition: PropTypes.shape({
      config: PropTypes.object,
      configIn: PropTypes.object,
      configOut: PropTypes.object,
      animation: PropTypes.func,
      onTransitionEnd: PropTypes.func,
    }),
    navigation: PropTypes.object,
  }

  state = {
    activeIndex: this.props.activeIndex,
    rendered: [this.props.activeIndex],
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
          i => i !== this.props.activeIndex
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

          const focused = childIndex === this.props.activeIndex

          const indices = [
            childIndex,
            this.state.previousIndex,
            this.props.activeIndex,
          ]

          const animation = slideInOut(indices)

          return (
            <Screen
              key={childIndex}
              index={childIndex}
              previousIndex={this.state.previousIndex}
              activeIndex={this.props.activeIndex}
              screen={{
                testID: focused
                  ? `active-screen`
                  : `inactive-screen-${childIndex}`,
                optimized: true,
                animated: this.props.animated || child.props.animated,
                style: { ...this.props.screenStyle, ...child.props.style },
              }}
              transition={{
                in: childIndex === this.props.activeIndex,
                animation: animation,
                ...this.props.transition,
                ...child.props.transition,
              }}
            >
              {React.cloneElement(child, {
                navigation: this.props.navigation,
                focused: childIndex === this.props.activeIndex,
              })}
            </Screen>
          )
        })}
      </View>
    )
  }
}

export { Tabs }
export default withScreenNavigation(Tabs)
