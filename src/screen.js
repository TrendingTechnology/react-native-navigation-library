import React from 'react'
import { View } from 'react-native'
import { withNavigation } from './navigator'
import Transition from './transition'

class Screen extends React.Component {
  render() {
    return (
      <Transition
        {...this.props.transition}
        activeIndex={this.props.activeIndex}
      >
        <View style={[this.props.style || { flex: 1 }]}>
          {this.props.children}
        </View>
      </Transition>
    )
  }
}

export { Screen }
export default withNavigation(Screen)
