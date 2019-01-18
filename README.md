# react-native-navigation-library

<p align="center">
  <img src="examples/signup-example.gif">
  <img src="examples/nested-feeds.gif">
</p>

<p align="center">
  <em>These aren't going to win any design awards, but hopefully you get the idea.</em>
</p>

# Why should I use this?

You want a composable, flexible, and declarative API for your app's navigation.

The primitives in this library (try to) stay out of your way as much as possible and lay more responsibility on the user (you). That means the code you write is focused on what you care about (UI/UX, hopefully) and uses what you're already familiar with: your components. And all of your Screens, Modals, Headers, TabBars, etc are colocated -- right there in your render function, so it's plain to see what's going on. It's super composable, so nesting your navigators and mapping out your app is relatively straightforward.

Sound good? Let's look at some examples:

# Navigation Components

### Tabs

*Note -- the API here was inspired (taken) from one of Ryan Florence's lectures -- thanks!*

Here's what a basic tab navigator might look like:

```
import { Navigator, Tabs, TabBar, Tab } from 'react-native-navigation-library'

<Navigator>
  <Tabs>
    <MyScreen title="Screen 1" />
    <MyScreen title="Screen 2" />
    <MyScreen title="Screen 3" />
  </Tabs>

  <TabBar>
    <Tab>
      <MyTab title="Tab 1" />
    </Tab>
    <Tab>
      <MyTab title="Tab 2" />
    </Tab>
    <Tab>
      <MyTab title="Tab 3" />
    </Tab>
  </TabBar>
</Navigator>
```

<p align="center">
  <img src="examples/tabs-example.gif">
</p>

### Stack

...and here's a stack navigator:

```
import { Navigator, Header, Stack } from 'react-native-navigation-library'

<Navigator>
  <Header>
    <MyHeader title="Header 1" />
    <MyHeader title="Header 2" />
    <MyHeader title="Header 3" />
  </Header>

  <Stack>
    <MyScreen title="Stack 1" />
    <MyScreen title="Stack 2" />
    <MyResetScreen title="Stack 3" />
  </Stack>
</Navigator>
```

<p align="center">
  <img src="examples/stack-example.gif" >
</p>

### Switch

A switch will only render one screen at a time:

```
import { Navigator, Switch } from 'react-native-navigation-library'

<Navigator>
  <Switch>
    <MyScreen title="Switch 1" />
    <MyScreen title="Switch 2" />
    <MyScreen title="Switch 3" />
    <MyResetScreen title="Switch 4" />
  </Switch>
</Navigator>
```

<p align="center">
  <img src="examples/switch-example.gif" >
</p>

### Modal

```
import { Navigator, Stack, Modal, Header } from 'react-native-navigation-library'

<Navigator>
  <Header>
    <MyHeader title="Header 1" />
    <MyHeader title="Header 2" />
    <MyHeader title="Header 3" />
  </Header>

  <Stack>
    <MyScreen title="Modal Panel 1" />
    <MyScreen title="Modal Panel 2" />
    <MyScreen title="Modal Panel 3" />
  </Stack>

  <Modal>
    <MyModal title="Modal for Panel 1" />
    <MyModal title="Modal for Panel 2" />
    <MyModal title="Modal for Panel 3" />
  </Modal>
</Navigator>
```

<p align="center">
  <img src="examples/modal-example.gif" >
</p>

Thats about it! There's a few more components that we'll get into later on, but hopefully you get the gist. Mix, match, and compose away. Nest navigators, put the tab bar where ever you want. You want a header for each of your tabs, or maybe just one or two of those tabs? No problem - you get to define the components that are rendered and where. But how to do the navigating?

# Navigation

Navigating around is (hopefully) fairly similar to what you're used to. Let's peer into one of the rendered child screens from above (e.g `<MyScreen />`):

```
function MyScreen(props) {
  // props.navigation has lots of useful stuff -- see below

  return (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.navigation.state.someData}</Text>
      <Button title="Next" onPress={() => props.navigation.push({ someData: 'new data' })} />
      <Button title="Previous" onPress={() => props.navigation.pop({ someData: 'other data' })} />
    </View>
  )
}
```

The navigation prop provides lots of useful stuff for your screens:

```
navigation: Navigation {
  push: (data: any) => void
  pop: (data: any) => void
  select: (index: number, data: any) => void
  navigate: (routeName: string, data: any) => void  // NOTE: you need to provide a `name` prop to your screens for this to work
  reset: () => void,
  state: {}: any,
  modal: {
    visible: boolean,
    show: (data: any) => void,
    dismiss: (data: any) => void,
  }
  parent?: (navigation: Navigation) // NOTE: this is only when your navigator is nested inside another navigator
}
```

### Using `navigation.navigate()`

As noted above, in order to navigate to a screen by it's name, you'll have to give that screen a `name` prop. Otherwise it will do nothing.

```
import { Navigator, Header, Switch } from 'react-native-navigation-library'

// navigation.navigate() will work for these screens

<Navigator>
  <Switch>
    <MyScreen name='first' />
    <MyScreen name='second' />
    <MyScreen name='third' />
    <MyResetScreen name='fourth' />
  </Switch>
</Navigator>
```

# Other Stuff

### Positioning screens

You can specify a layout for a given screen with the style prop:

```
import { Screen, Navigator, Stack } from 'react-native-navigation-library'

<Navigator>
  <Stack>
    <MyScreen title="Screen 1" />

    <MiniScreen
      title="A mini screen"
      style={{
        position: 'absolute',
        left: 30,
        right: 30,
        top: 100,
        bottom: 100,
        borderWidth: 1,
      }}
    />
  </Stack>
</Navigator>
```

<p align="center">
  <img src="examples/screen-example.gif" >
</p>

### Header

```
import { Header, Navigator, Stack } from 'react-native-navigation-library'

<Navigator>
  <Header>
    <MyHeader title='Header 1">
    <MyHeader title='Header 2">
  </Header>

  <Stack>
    <MyScreen title='Screen 1'>
    <MyScreen title='Screen 2'>
    <MyScreen title='Screen 3 -- I have no header'>
  </Stack>
</Navigator>
```

Each header child element is mapped to a screen in the `<Stack />`, so you declare what component is rendered for each screen, or if you don't want different headers, you can just copy paste the same component like I did in the example above.

You might also notice that there is only two header elements but three screens -- in my example I didn't want a header on the third screen, so 'Screen 3' will have a hidden header

### TabBar

Each `<Tab />` receives an `active` prop which can be used to render active / inactive states. Other than that, `<Tab />` is a relatively dumb component -- what you render inside is completely up to you!

```
import { Navigator, Header, Tabs, TabBar, Tab } from 'react-native-navigation-library'

<Navigator>
  <Tabs>
    <MyScreen title="Panel 1"  />
    <MyScreen title="Panel 2"  />
    <MyScreen title="Panel 3"  />
  </Tabs>

  <TabBar>
    <Tab>
      <MyTab title="Tab 1" />
    </Tab>
    <Tab>
      <MyTab title="Tab 2" />
    </Tab>
    <Tab>
      <MyTab title="Tab 3" />
    </Tab>
  </TabBar>
</Navigator>
```

### Navigator

It's worth noting that any nested `<Navigator />` will expose it's parent navigation inside the navigation prop

For now, `<Navigator />` has one prop:

```
class App extends React.Component {
  state = {
    activeIndex: 0,
    navigation: {},
  }

  handleNavigationChange = (updatedNavigation: Navigation) => {
    this.setState({
      activeIndex: updatedNavigation.activeIndex,
      navigation: updatedNavigation.navigation,
    })
  }

  render() {
    return (
      <Navigator onNavigationChange={this.handleNavigationChange}>
        <Stack>
          <MyScreen title='Hi' />
        </Stack>
      </Navigator>
    )
  }
}
```

This can be useful if you'd like to peer inside of a nested navigator, maybe to update your app container's state, or hide a parent tab bar -- there's lots of cool stuff you can do with it.

# WIP

I've copied a lot of the animations but they still need some tweaking. These are configurable via animation and interpolation props.

# Pros and Cons

This library might not be for everyone.

I was frustrated with how separated everything seemed using other libraries, but some people might like it that way.

Some features aren't that implemented (yet):

- deep linking
- navigating through several layers of navigators
- probably a lot of other stuff I haven't thought of

Navigating certainly is not at the same level of sophistication as a library like `react-navigation` or `react-native-navigation`, although I believe that those libraries also help create that need for you.

Lastly, committing to a navigation library can have a large impact on how you architect your app. This library is pretty small, and you can incrementally adopt it in small parts -- it's possible to experiment, and I hope that you do!

# Acknowledgements

The inspiration for this API came from watching [Ryan Florence's talks](https://reach.tech), specifically the lectures he's done on Tabs components. So, thank you Ryan!

I'm sure I have missed a ton of stuff, so do not hesitate and reach out!
