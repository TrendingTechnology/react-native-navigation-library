import React from 'react'
import {
  NativeRouter as Router,
  DeepLinking,
  Route,
  BackButton,
} from 'react-router-native'

class AppNavigation extends React.Component {
  render() {
    return (
      <Router initialEntries={[this.props.location]}>
        <DeepLinking>
          <BackButton />
          <Route
            children={({ history }) => {
              return (
                <UpdateLocation
                  location={this.props.location}
                  history={history}
                >
                  {this.props.children}
                </UpdateLocation>
              )
            }}
          />
        </DeepLinking>
      </Router>
    )
  }
}

// makes it easier to update the location in devtools
class UpdateLocation extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.props.history.replace(this.props.location)
    }
  }

  render() {
    return this.props.children
  }
}

export default AppNavigation
