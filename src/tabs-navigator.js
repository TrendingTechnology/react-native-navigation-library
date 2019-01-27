import React from 'react'
import { withTransitionNavigation } from './navigator'

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
    if (!this.props.children) {
      return null
    }

    const children = React.Children.toArray(this.props.children)

    return this.state.rendered.map(childIndex => {
      const child = children[childIndex]

      if (!child) {
        return null
      }

      return React.cloneElement(child, {
        transition: {
          index: childIndex,
          in: childIndex === this.props.activeIndex,
          optimized: true,
        },
      })
    })
  }
}

export { Tabs }
export default withTransitionNavigation(Tabs)
