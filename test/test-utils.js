import React from 'react'
import { View, Button, Text } from 'react-native'

function NavigateComponent(props) {
  const isActive = props.activeIndex === props.index

  return (
    <View>
      <Button
        title={props.title}
        onPress={() => props.onPress(props.navigation)}
      />
      <Text>{props.navigation.state[props.value]}</Text>
      <Text>{`${props.title}-${isActive ? 'active' : 'inactive'}`}</Text>
    </View>
  )
}

export { NavigateComponent }
