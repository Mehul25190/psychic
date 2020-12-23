// Imports: Dependencies
import React from 'react';
import { View, Text, Image, StatusBar, AppState, Alert } from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';

import * as Font from 'expo-font';

/*import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';*/
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';

import { StyleProvider, Root } from 'native-base';
import getTheme from './app/theme/components';
import material from './app/theme/variables/material';

// Imports: Navigation
import ReduxNavigation from './app/navigation/ReduxNavigation';

// Imports: Redux Persist Persister
import { store, persistor } from './app/store/store';
import SocketContext from './app/containers/Context/socket-context';
import io, { Socket } from 'socket.io-client';
import { Notification } from 'react-native-in-app-message';
import AsyncStorage from '@react-native-community/async-storage';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

socket = io('http://161.97.122.135:3000/webrtcPeer', {
  path: '/webrtc',
  query: {}
})

// React Native: App
export default class App extends React.Component {

  notificationRef = React.createRef();

  constructor() {
    super();
    this.state = {
      isReady: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      // 'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      ...Ionicons.font,
      ...FontAwesome.font,
      ...AntDesign.font,
      'Font-Light': require('./app/assets/fonts/Montserrat-Light.ttf'),
      'Font-Regular': require('./app/assets/fonts/Montserrat-Regular.ttf'),
      'Font-Semibold': require('./app/assets/fonts/Montserrat-SemiBold.ttf'),
      'Font-Bold': require('./app/assets/fonts/Montserrat-Bold.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    });
    // this.setState({ isReady: true });
  }

  /* async componentDidMount() {
    // this.checkPermission()
    // this.createNotifcationListeners()
  }

  async checkPermission() {
    const enable = await firebase.messaging().hasPermission();
    if(enable) {
      this.getToken()
    } else {
      this.requestPermission()
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if(!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if(fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken()
    } catch(error) {
      console.log('Permission rejected for notification.')
    }
  }

  async createNotifcationListeners() {
    this.notificationListener = firebase.notifications().onNotification(notification => {
      const { title, body } = notification;
      this.displayNotification(title, body)
    })

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notification => {
      const { title, body } = notification
      this.displayNotification(title, body)
    })

    const notificationOpen = firebase.notifications().getInitialNotification()
      .then(notification => {
        const { title, body } = notification
        this.displayNotification(title, body)
      })
  }

  displayNotification(title, body) {
    Alert.alert(
      title, body, 
      [
        { text: 'OK' }
      ],
      { cancelable: false }
    )
  } */

  render() {
    return (
      // Redux: Global Store
      <SocketContext.Provider value={{
        socket: socket,
        notificationRef: this.notificationRef
      }}>
        <Provider store={store}>
          <StyleProvider style={getTheme(material)}>
            <Root>
              {/* <StatusBar hidden /> */}
              <Notification text={'Notification received'} ref={this.notificationRef} autohide={true} duration={5000} hideStatusBar />
              <ReduxNavigation />
            </Root>
          </StyleProvider>
        </Provider>
      </SocketContext.Provider>
    );
  }
};