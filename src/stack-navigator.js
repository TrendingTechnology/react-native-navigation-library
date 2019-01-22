import React from 'react'
import { withScreenNavigation } from './navigator'

class Stack extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children).slice(
      0,
      this.props.transitioning
        ? Math.max(this.props.previousIndex + 1, this.props.activeIndex + 1)
        : this.props.activeIndex + 1,
    )

    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        transition: {
          index,
          in: index <= this.props.activeIndex,
        },
      })
    })
  }
}

export { Stack }
export default withScreenNavigation(Stack)
