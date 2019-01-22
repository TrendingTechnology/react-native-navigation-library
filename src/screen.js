import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withNavigation } from './navigator'
import Transition from './transition'

class Screen extends React.Component {
  render() {
    if (!this.props.animated) {
      return (
        <View
          style={[
            {
              flex: 1,
              backgroundColor: 'white',
              ...StyleSheet.absoluteFillObject,
            },
            this.props.style,
          ]}
        >
          {this.props.children}
        </View>
      )
    }

    return (
      <Transition
        {...this.props.transition}
        activeIndex={this.props.activeIndex}
      >
        <View style={[{ flex: 1, backgroundColor: 'white' }, this.props.style]}>
          {this.props.children}
        </View>
      </Transition>
    )
  }
}

export { Screen }
export default withNavigation(Screen)
