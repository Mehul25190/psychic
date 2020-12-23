import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList, BackHandler } from 'react-native'
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

class Chat extends React.Component {

  flatlist = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      message: '',
      data: [],
      count: 0,
    }
  }
  renderDate = (date) => {
    return (
      <Text style={styles.time}>
        {new Date(date).getHours().toString() + ':' + new Date(date).getMinutes().toString()}
      </Text>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.updateCredit)
    this.props.socket.on('notification', data => {
      this.props.notificationRef.current?.show()
    })

    this.props.socket.on('message', message => {
      console.log("Message from server : ", message)
      this.setState({
        data: [...this.state.data, {
          id: this.state.data.length + 1,
          time: Date.now(),
          messageType: 'in',
          message: message.message
        }]
      })
    })

    this.props.navigation.addListener('didFocus', () => {
      this.props.getChat(this.props.user.id, this.props.navigation.state.params.toUserId)
        .then(res => {
          this.setState({
            data: res.data
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
    console.log('Count: ', this.state.count)
    if (this.state.count > 0) {
      this.props.usedCredit(this.props.user.id, this.state.count * this.props.navigation.state.params.rate);
    }
  }

  render() {

    const { search } = this.state;
    return (
      <Container>
        <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <Button transparent full
              onPress={() => {
                this.updateCredit();
                this.props.goBack();
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
            <Icon type='Entypo' style={styles.iconSend} name='video-camera' />
          </Right>
        </Header>
        <Content enableOnAndroid style={appStyles.content} bounces={false}>
          <View style={styles.container}>
            <FlatList
              ref={(ref) => this.flatlist = ref}
              onLayout={() => this.flatlist.scrollToEnd()}
              style={styles.list}
              data={this.state.data}
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={(message) => {
                console.log(item);
                const item = message.item;
                let inMessage = item.messageType === 'in';
                let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
                return (
                  <View style={[styles.item, itemStyle]}>
                    {!inMessage && this.renderDate(item.time)}
                    <View style={[styles.balloon]}>
                      <Text>{item.message}</Text>
                    </View>
                    {inMessage && this.renderDate(item.time)}
                  </View>
                )
              }} />

          </View>
        </Content>
        <Footer>
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={this.state.message}
                placeholder="Write a message..."
                underlineColorAndroid='transparent'
                onChangeText={(name_address) => this.setState({ message: name_address })} />
            </View>

            <TouchableOpacity style={styles.btnSend} onPress={() => {
              if (this.state.count >= this.props.navigation.state.params.allowedText) {
                showToast('You do not have sufficiant credits to send message', 'danger')
              } else {
                this.sendToPeer('message', {
                  message: this.state.message,
                  toUserId: this.props.navigation.state.params.toUserId,
                  fromUserId: this.props.user.id
                }, this.props.navigation.state.params.socketId)
                this.flatlist.scrollToEnd()
                this.setState({
                  data: [...this.state.data, {
                    time: Date.now(),
                    messageType: 'out',
                    message: this.state.message
                  }],
                  message: '',
                  count: this.state.count + 1,
                })
              }
            }}>
              <Icon style={styles.iconSend} name="send" />
            </TouchableOpacity>
          </View>
        </Footer>

      </Container>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
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
    goBack: () => dispatch(NavigationActions.back())
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Chat {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);