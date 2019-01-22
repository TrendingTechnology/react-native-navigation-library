import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export { width as screenWidth, height as screenHeight, getDisplayName }
