import React from 'react'
import { View, TouchableOpacity } from 'react-native'
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

  updateModal = (navigation) => {
    this.setState((state) => {
      return {
        navigation: {
          ...state.navigation,
          modal: navigation,
        },
      }
    })
  }

  state = {
    activeIndex: 0,
    updateActiveIndex: this.updateActiveIndex,
    navigation: {},
    updateNavigation: this.updateNavigation,
    updateModal: this.updateModal,
  }

  render() {
    return (
      <Provider value={this.state}>
        <View style={[{ flex: 1 }, this.props.style]}>
          {this.props.children}
        </View>
      </Provider>
    )
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
      transitioning: false,
    }

    props.updateNavigation &&
      props.updateNavigation({
        pop: this.pop,
        push: this.push,
        reset: this.reset,
        select: this.select,
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
          transitioning: true,
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

  select = (index = 0) => {
    if (this.props.children[index]) {
      this.props.updateActiveIndex(index)
    }
  }

  handleTransitionEnd = () => {
    this.setState({ transitioning: false })
  }

  render() {
    const children = React.Children.toArray(this.props.children)

    const childrenToRender = this.state.rendered.map((childIndex) => {
      const child = React.cloneElement(children[childIndex], {
        navigation: this.props.navigation,
      })

      const transitionIn =
        this.state.transitioning && childIndex === this.props.activeIndex

      const transitionOut =
        this.state.transitioning && childIndex !== this.props.activeIndex

      return (
        <Transition
          key={childIndex}
          transitionIn={transitionIn}
          transitionOut={transitionOut}
          onTransitionEnd={this.handleTransitionEnd}>
          {child}
        </Transition>
      )
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
    return (
      <View style={[{ flexDirection: 'row' }, this.props.style]}>
        {React.Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, {
            active: index === this.props.activeIndex,
            navigation: {
              onSelect: () => this.props.updateActiveIndex(index),
            },
          })
        })}
      </View>
    )
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

class Tab extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          { flex: 1, height: 60, backgroundColor: 'white' },
          this.props.style,
        ]}
        onPress={this.props.navigation.onSelect}>
        {React.cloneElement(this.props.children, {
          active: this.props.active,
        })}
      </TouchableOpacity>
    )
  }
}

class Switch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      popIndex: -1,
    }

    props.updateNavigation &&
      props.updateNavigation({
        push: this.push,
      })
  }

  push = (index = 1) => {
    if (this.props.children[this.props.activeIndex + index]) {
      this.props.updateActiveIndex(this.props.activeIndex + index)
    }
  }

  pop = (index = 1) => {
    if (this.props.children[this.props.activeIndex - index]) {
      this.setState({
        popIndex: this.props.activeIndex,
      })

      this.props.updateActiveIndex(this.props.activeIndex + index)
    }
  }

  handleTransitionEnd = () => {
    this.setState({
      popIndex: -1,
    })
  }

  render() {
    const child = React.Children.toArray(this.props.children)[
      this.state.popIndex >= 0 ? this.state.popIndex : this.props.activeIndex
    ]

    return (
      <Transition
        transitionOut={this.state.popIndex !== -1}
        onTransitionEnd={this.handleTransitionEnd}>
        {React.cloneElement(child, { navigation: this.props.navigation })}
      </Transition>
    )
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

class Screen extends React.Component {
  render() {
    const api = this.props.navigator(this.props.navigation)

    return (
      <View style={[{ flex: 1 }, this.props.style]}>
        {React.cloneElement(this.props.children, { ...api })}
      </View>
    )
  }
}

/*
  <Navigator>
    <Stack>
      <Screen 1 />
      <Screen 2 />
      <Screen 3 />
    </Stack>

    <Modal>
      <Modal 1 />
      <Modal 2 />
      <Modal 3 />
    </Modal>
  </Navigator>
*/

class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      popIndex: -1,
      activeModal: -1,
    }

    props.updateModal &&
      props.updateModal({
        push: this.push,
        pop: this.pop,
      })
  }

  push = (index = 0) => {
    const children = React.Children.toArray(this.props.children)

    if (children[index]) {
      this.setState({
        activeModal: index,
      })
    }
  }

  pop = () => {
    this.setState((state) => {
      return {
        activeModal: -1,
        popIndex: state.activeModal,
      }
    })
  }

  handleTransitionEnd = () => {
    this.setState({
      popIndex: -1,
    })
  }

  render() {
    const children = React.Children.toArray(this.props.children)
    const child =
      children[
        this.state.popIndex >= 0 ? this.state.popIndex : this.state.activeModal
      ]

    if (!child) {
      return null
    }

    return (
      <Transition
        animationTransform={(anim) => {
          return [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1000, 0],
              }),
            },
          ]
        }}
        transitionOut={this.state.popIndex !== -1}
        transitionIn={this.state.activeModal >= 0}
        onTransitionEnd={this.handleTransitionEnd}>
        {React.cloneElement(child, { navigation: this.props.navigation })}
      </Transition>
    )
  }
}

class ModalContainer extends React.Component {
  render() {
    return (
      <Consumer>
        {(context) => {
          return <Modal {...context} {...this.props} />
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
  Tab,
  SwitchContainer as Switch,
  Navigator,
  Transition,
  Screen,
  ModalContainer as Modal,
}
