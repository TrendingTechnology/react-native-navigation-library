import React from 'react'
import { TouchableHighlight } from 'react-native'
import { withRouter } from 'react-router-native'

// react-router link throws some issues w/ testing
// the event object is not properly setup, so this works w/o the event
class Link extends React.Component {
  handlePress = () => {
    const { to, replace, history } = this.props

    if (replace) {
      history.replace(to)
    } else {
      history.push(to)
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this.handlePress}>
        {this.props.children}
      </TouchableHighlight>
    )
  }
}

export { Link }
export default withRouter(Link)
