import React from 'react'
import { Text, Animated, Easing } from 'react-native'
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'

import { SignIn, SignUp, Forgotpassword, Home, Drawer, Newsfeed, NewsDetail, Horoscope, Messages, Settings, Chat, Call, Package } from "../containers";
// import { Call } from '../containers/Messages';
import { Colors, Screens } from "../constants";

const transitionConfig = () => ({
      transitionSpec: {
        duration: 600,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const width = layout.initWidth;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateX }] };
      },
    });

// drawer stack
const DrawerStack = createDrawerNavigator({
  [Screens.Home.route]: { 
    screen: Home 
  },
  [Screens.Newsfeed.route]: { 
    screen: Newsfeed 
  },
  [Screens.NewsDetail.route]: { 
    screen: NewsDetail 
  },
  [Screens.Horoscope.route]: { 
    screen: Horoscope 
  },
  [Screens.Messages.route]: { 
    screen: Messages 
  },
  [Screens.Chat.route]: { 
    screen: Chat 
  },
  [Screens.Call.route]: { 
    screen: Call 
  },
  [Screens.Settings.route]: { 
    screen: Settings 
  },
  [Screens.Package.route]: { 
    screen: Package 
  },
}, {
  gesturesEnabled: true,
  // drawerBackgroundColor: 'rgba(255,255,255,.9)',
  drawerType: 'front',
  hideStatusBar: false,
  drawerLockMode: 'locked-closed', // to lock the drawer by slide open
  statusBarAnimation: 'slide',
  overlayColor: Colors.primaryDark,
  contentOptions: {
    activeTintColor: Colors.lightBlack,
    activeBackgroundColor: Colors.primaryLight,
  },
  transitionConfig: transitionConfig,
  contentComponent: (props) => <Drawer {...props} />,
});

const DrawerNavigation = createStackNavigator({
  [Screens.DrawerStack.route]: { screen: DrawerStack }
}, {
  headerMode: 'none',
  transitionConfig: transitionConfig
});

// login stack
const LoginStack = createStackNavigator({
  [Screens.SignIn.route]: { screen: SignIn },
  [Screens.SignUp.route]: { screen: SignUp},
  [Screens.ForgotPassword.route]: { screen: Forgotpassword },
}, {
  headerMode: 'none',
  initialRouteName: Screens.SignIn.route,
  transitionConfig: transitionConfig
});

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  [Screens.SignOutStack.route]: { screen: LoginStack },
  [Screens.Home.route]: { screen: Home },
  [Screens.Newsfeed.route]: { screen: Newsfeed },
  [Screens.NewsDetail.route]: { screen: NewsDetail },
  [Screens.Horoscope.route]: { screen: Horoscope },
  [Screens.Messages.route]: { screen: Messages },
  [Screens.Call.route]: { screen: Call },
  [Screens.Chat.route]: { screen: Chat },
  [Screens.SignInStack.route]: { screen: DrawerNavigation }
}, {
  headerMode: 'none',
  initialRouteName: Screens.Home.route,
  transitionConfig: transitionConfig
});

export default PrimaryNav