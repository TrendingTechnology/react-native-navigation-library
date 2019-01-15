import React from 'react'

function cloneWithNavigation(child, props, extra = {}) {
  if (!child) {
    return null
  }

  return React.cloneElement(child, {
    navigation: props.navigation,
    data: props.data,
    ...extra,
  })
}

export { cloneWithNavigation }
