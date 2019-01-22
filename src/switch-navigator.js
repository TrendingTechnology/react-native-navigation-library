import React from 'react'
import { withScreenNavigation } from './navigator'

class Switch extends React.Component {
  state = {
    rendered: [this.props.activeIndex],
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState(state => {
        const previous = state.rendered.filter(
          i => i !== this.props.activeIndex,
        )
        return {
          rendered: [this.props.activeIndex, ...previous],
        }
      })
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    return [
      this.props.transitioning && this.props.previousIndex,
      this.props.activeIndex,
    ]
      .filter(i => i === 0 || Boolean(i))
      .map(childIndex => {
        const child = children[childIndex]

        return React.cloneElement(child, {
          activeIndex: this.props.activeIndex,
          transition: {
            index: childIndex,
            in: this.props.activeIndex === childIndex,
            optimized: true,
          },
          navigation: this.props.navigation,
        })
      })
  }
}

export { Switch }
export default withScreenNavigation(Switch)
