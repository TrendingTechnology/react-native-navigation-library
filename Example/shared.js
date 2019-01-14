import React from 'react'
import { View, StyleSheet } from 'react-native'

function Screen(props) {
  return <View style={styles.container}>{props.children}</View>
}

function Header(props) {
  return <View style={styles.header}>{props.children}</View>
}

function Tab(props) {
  return (
    <View style={[styles.tab, props.active ? styles.active : styles.inactive]}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  active: {
    borderBottomColor: 'black',
  },
  inactive: {
    borderColor: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

export { Screen, Header, Tab }
