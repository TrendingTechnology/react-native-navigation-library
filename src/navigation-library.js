import React from 'react'
import { View } from 'react-native'
import Transition from './transition'

const { Provider, Consumer } = React.createContext()

class Navigator extends React.Component {
  updateActiveIndex = (index) => {
    this.setState({ activeIndex: index }, () => {
      if (this.props.onNavigationChange) {
        this.props.onNavigationChange(this.state.activeIndex)
      }
    })
  }

  updateNavigation = (navigation) => {
    this.setState({
      navigation: {
        ...navigation,
        parent: this.props.navigation,
      },
    })
  }

  state = {
    activeIndex: 0,
    updateActiveIndex: this.updateActiveIndex,
    navigation: {},
    updateNavigation: this.updateNavigation,
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

class Stack extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      popping: false,
      popIndex: -1,
    }

    props.updateNavigation &&
      props.updateNavigation({
        pop: this.pop,
        push: this.push,
        reset: this.reset,
      })
  }

  pop = (index = 1) => {
    if (this.props.children[this.props.activeIndex - index]) {
      this.setState(
        {
          popping: true,
          popIndex: this.props.activeIndex,
        },
        () => {
          this.props.updateActiveIndex(this.props.activeIndex - index)
        },
      )
    }
  }

  push = (index = 1, data) => {
    if (this.props.activeIndex < this.props.children.length - 1) {
      this.props.updateActiveIndex(this.props.activeIndex + index, data)
    }
  }

  reset = () => {
    this.pop(this.props.activeIndex)
  }

  handleTransitionEnd = () => {
    this.setState({ popping: false, popIndex: -1 })
  }

  render() {
    const cutoffIndex = this.state.popping
      ? this.state.popIndex + 1
      : this.props.activeIndex + 1

    const children = React.Children.toArray(this.props.children).slice(
      0,
      cutoffIndex,
    )

    return (
      <View style={[{ flex: 1 }]}>
        {React.Children.map(children, (child, index) => {
          return (
            <Transition
              transitionOut={
                this.state.popping && index > this.props.activeIndex
              }
              onTransitionEnd={this.handleTransitionEnd}>
              {React.cloneElement(child, {
                navigation: this.props.navigation,
              })}
            </Transition>
          )
        })}
      </View>
    )
  }
}

class StackContainer extends React.Component {
  render() {
    return (
      <Consumer>{(context) => <Stack {...context} {...this.props} />}</Consumer>
    )
  }
}

class Header extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)

    if (!children[this.props.activeIndex]) {
      return null
    }

    return React.cloneElement(children[this.props.activeIndex], {
      navigation: this.props.navigation,
      activeIndex: this.props.activeIndex,
    })
  }
}

class HeaderContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {(context) => <Header {...context} {...this.props} />}
      </Consumer>
    )
  }
}

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rendered: [this.props.activeIndex],
    }

    props.updateNavigation &&
      props.updateNavigation({
        pop: this.pop,
        push: this.push,
        reset: this.reset,
      })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.setState((state) => {
        const previous = state.rendered.filter(
          (i) => i !== this.props.activeIndex,
        )
        return {
          rendered: [...previous, this.props.activeIndex],
        }
      })
    }
  }

  pop = (index = 1) => {
    const prev = this.state.rendered[this.state.rendered.length - 1 - index]
    if (prev >= 0) {
      this.props.updateActiveIndex(prev)
    }
  }

  push = (index = 1) => {
    if (index < this.props.children.length) {
      this.props.updateActiveIndex(this.props.activeIndex + index)
    }
  }

  reset = () => {
    this.props.updateActiveIndex(0)
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    const childrenToRender = this.state.rendered.map((childIndex) => {
      const child = React.cloneElement(children[childIndex], {
        navigation: this.props.navigation,
      })

      return <Transition key={childIndex}>{child}</Transition>
    })

    return <View style={{ flex: 1 }}>{childrenToRender}</View>
  }
}

class TabsContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {(context) => {
          return <Tabs {...context} {...this.props} />
        }}
      </Consumer>
    )
  }
}

class TabBar extends React.Component {
  render() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        active: index === this.props.activeIndex,
        navigation: {
          onSelect: () => this.props.updateActiveIndex(index),
        },
      })
    })
  }
}

class TabBarContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {(context) => {
          return <TabBar {...context} {...this.props} />
        }}
      </Consumer>
    )
  }
}

class Switch extends React.Component {
  constructor(props) {
    super(props)

    props.updateNavigation &&
      props.updateNavigation({
        push: this.push,
        pop: this.pop,
      })
  }

  pop = (index = 1) => {
    if (this.props.children[this.props.activeIndex - index]) {
      this.props.updateActiveIndex(this.props.activeIndex - index)
    }
  }

  push = (index = 1) => {
    if (this.props.children[this.props.activeIndex + index]) {
      this.props.updateActiveIndex(this.props.activeIndex + index)
    }
  }

  render() {
    const child = React.Children.toArray(this.props.children)[
      this.props.activeIndex
    ]
    return React.cloneElement(child, { navigation: this.props.navigation })
  }
}

class SwitchContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {(context) => {
          return <Switch {...context} {...this.props} />
        }}
      </Consumer>
    )
  }
}

export {
  StackContainer as Stack,
  HeaderContainer as Header,
  TabsContainer as Tabs,
  TabBarContainer as TabBar,
  SwitchContainer as Switch,
  Navigator,
  Transition,
}
