import React from 'react'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

function cloneWithNavigation(child, props, extra = {}) {
  if (!child) {
    return null
  }

  return React.cloneElement(child, {
    navigation: props.navigation,
    ...extra,
  })
}

export { cloneWithNavigation, width as screenWidth, height as screenHeight }
