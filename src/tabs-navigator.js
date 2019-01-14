import React from 'react'
import { View } from 'react-native'
import { createNavigationContainer } from './navigator'
import { cloneWithNavigation } from './lib'
import Transition from './transition'

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rendered: [this.props.activeIndex],
      transitioning: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState((state) => {
        const previous = state.rendered.filter(
          (i) => i !== this.props.activeIndex,
        )
        return {
          rendered: [...previous, this.props.activeIndex],
          transitioning: true,
        }
      })
    }
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    const childrenToRender = this.state.rendered.map((childIndex) => {
      const child = cloneWithNavigation(children[childIndex], this.props)

      if (!child) {
        return null
      }

      const transitionIn =
        this.state.transitioning && childIndex === this.props.activeIndex

      const transitionOut =
        this.state.transitioning && childIndex !== this.props.activeIndex

      return (
        <Transition
          key={childIndex}
          transitionIn={transitionIn}
          transitionOut={transitionOut}
          onTransitionEnd={this.handleTransitionEnd}>
          {child}
        </Transition>
      )
    })

    return <View style={{ flex: 1 }}>{childrenToRender}</View>
  }
}

export default createNavigationContainer(Tabs)
