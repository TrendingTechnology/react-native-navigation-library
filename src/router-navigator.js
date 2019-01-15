import React from 'react'
import Tabs from './tabs-navigator'
import { createNavigationContainer, Screen } from './navigator'

/*  

  Pass an additional navigation function 'navigate' which can navigate between 
  child screens by name (e.g navigation.navigate('screen-1'))

  <Navigator>
    <Router>
      <Route name='screen-1'>
        <Screen 1 />
      </Route>
      <Route name='screen-2'>
        <Screen 2 />
      </Route>
      <Route name='screen-3'>
        <Screen 3 />
      </Route>
    </Router>
  </Navigator> 
*/

class Router extends React.Component {
  state = {
    routes: this.props.children.map((child) => child.props.name),
  }

  render() {
    const navigation = {
      ...this.props.navigation,
      navigate: (routeName, data) => {
        const route = this.state.routes.indexOf(routeName)
        if (route !== -1) {
          this.props.navigation.select(route, data)
        }
      },
    }

    return <Tabs navigation={navigation}>{this.props.children}</Tabs>
  }
}

class Route extends React.Component {
  render() {
    return (
      <Screen navigation={this.props.navigation} name={this.props.name}>
        {this.props.children}
      </Screen>
    )
  }
}

export { Route }
export default createNavigationContainer(Router)
