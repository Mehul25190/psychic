import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, KeyboardAvoidingView, BackHandler, ActivityIndicator, Platform } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes } from '../../constants';
import { Logo, Statusbar, Headers, Svgicon, LoginBackIcon, FooterIcon, ModalBox, InputBoxWithoutIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button,
  Text, Row, Col, Item, Input, List, ListItem, Form,
  Header, Left, Body, Title, Right, Footer, FooterTab, Thumbnail,
} from 'native-base';
import { connect, Field } from "react-redux";
import * as userActions from "../../actions/user";
import appStyles from '../../theme/appStyles';
import styles from './styles';
import { SearchBar } from 'react-native-elements';
import { NewsFeed } from './Data.js';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';
import io from 'socket.io-client';
import SocketContext from '../Context/socket-context';
import { showToast } from '../../utils/common';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native';

class Chat extends React.Component {

  flatListRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      message: '',
      data: [],
      count: 0,
      giftedMessage: []
    }
  }

  componentDidMount() {
    /* this.backHandler =  */BackHandler.addEventListener('hardwareBackPress', this.updateCredit)

    this.props.socket.on('message', message => {
      this.setState({
        giftedMessage: GiftedChat.append(this.state.giftedMessage, {
          _id: message.message.id,
          createdAt: Date.now(),
          text: message.message.message,
          user: {
            _id: message.message.fromUserId
          }
        })
      })
    })

    this.props.navigation.addListener('didFocus', () => {
      this.props.getChat(this.props.user.id, this.props.navigation.state.params.toUserId)
        .then(res => {
          let x = [];
          res.data.forEach(element => {
            x.push({
              _id: element._id.toString(),
              createdAt: element.time,
              text: element.message,
              user: {
                _id: element.messageType == 'in' ? this.props.navigation.state.params.toUserId : this.props.user.id,
              }
            })
          });
          this.setState({
            giftedMessage: x,
            count: 0
          })
        })
        .then(err => console.log(err))
    })

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.updateCredit)
  }

  sendToPeer = (message, payload, toSocketId) => {
    this.props.socket.emit(message, {
      socketId: {
        local: this.props.socket.id,
        remote: toSocketId
      },
      payload
    })
  }

  updateCredit = () => {
    if (this.props.user && this.props.user.is_psychic != 1 && this.state.count > 0) {
      const finalCount = this.state.count
      this.setState({ count: 0 })
      this.props.usedCredit(this.props.user.id, finalCount * this.props.navigation.state.params.rate)
        .then(res => {
          this.props.updateCredit(res.data)
        })
    }
    this.props.goBack();
    return true
  }

  render() {

    const { search } = this.state;
    return (

      <Container>
        <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <Button transparent full
              onPress={() => {
                this.updateCredit()
              }}
              style={appStyles.loginBackcustom}
            >
              <Icon name="ios-arrow-back" style={appStyles.loginBackIcon} />
            </Button>
            {/* <LoginBackIcon props={this.props} /> */}
          </Left>
          <Body style={appStyles.rowXcenter}>
            <Title style={appStyles.titlewidth}>{this.props.navigation.state.params.name}</Title>
          </Body>
          <Right>
            {/* <Icon type='Entypo' style={styles.iconSend} name='video-camera' /> */}
          </Right>
        </Header>
        <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={Platform.select({ ios: 'padding' })} >
          {/* <Content enableOnAndroid contentContainerStyle={{ flex: 1, height: '100%' }} bounces={false}> */}
          {this.props.isLoading ?
            <ActivityIndicator color={Colors.primary} size='large' /> :
            <GiftedChat
              messages={this.state.giftedMessage}
              alwaysShowSend
              renderSend={(props) => (
                <Send {...props} disabled={!props.text}
                  containerStyle={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 2,
                  }}>
                  <Icon type='Ionicons' name='send' style={{ color: Colors.primary, width: 32, height: 32 }} />
                </Send>
              )}
              renderChatEmpty={() => (
                <KeyboardAvoidingView enabled behavior='padding' style={{ flex: 1, justifyContent: 'center', alignItems: 'center', transform: [{ scaleY: -1 }] }}>
                  <Text style={{ color: 'grey', fontWeight: '400', justifyContent: 'flex-end' }}>
                    No message available
                </Text>
                </KeyboardAvoidingView>
              )}
              onSend={message => {
                if (this.props.user.is_psychic != 1 && this.state.count >= this.props.navigation.state.params.allowedText) {
                  showToast('You do not have sufficiant credits to send message', 'danger')
                } else {
                  this.sendToPeer('message', {
                    id: message[0]._id,
                    message: message[0].text,
                    toUserId: this.props.navigation.state.params.toUserId,
                    fromUserId: this.props.user.id,
                    user: {
                      id: this.props.navigation.state.params.toUserId,
                      name: this.props.navigation.state.params.name,
                      email: this.props.navigation.state.params.email,
                      text_rate: this.props.navigation.state.params.rate,
                      profile_img_path: this.props.navigation.state.params.profileImagePath,
                      is_psychic: 1
                    }
                  }, this.props.navigation.state.params.socketId)
                  this.setState({
                    giftedMessage: GiftedChat.append(this.state.giftedMessage, message),
                    count: this.state.count + 1,
                    message: ''
                  })
                }
              }}
              user={{
                _id: this.props.user.id
              }}
            />
          }
          {/* </Content> */}
        </KeyboardAvoidingView>
      </Container>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isLoading: state.common.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(userActions.logoutUser()),
    showModal: () => {
      dispatch({ type: ActionTypes.SHOWMODAL, showModal: true })
    },
    hideModal: () => {
      dispatch({ type: ActionTypes.SHOWMODAL, showModal: false })
    },
    getChat: (fromId, toId) => dispatch(userActions.getChat({
      fromUserId: fromId,
      toUserId: toId
    })),
    usedCredit: (userId, credits) => dispatch(userActions.creditUsed({
      user_id: userId,
      credits: credits,
      type: 'text'
    })),
    goBack: () => dispatch(NavigationActions.navigate({ routeName: Screens.Messages.route })),
    updateCredit: (data) => dispatch({
      type: ActionTypes.SIGNIN,
      data: data
    })
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Chat {...props} socket={value.socket} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);