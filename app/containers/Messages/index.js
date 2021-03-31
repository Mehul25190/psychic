import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList, AppState, ActivityIndicator } from 'react-native'
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
import SocketContext from '../Context/socket-context';
import moment from 'moment';

class Messages extends React.Component {

  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      data: [],
      users: [],
      fullData: []
    }
  }

  appState = () => {
    if (AppState.currentState == 'active') {
      console.log("State : ", AppState.currentState)
      this.props.socket.emit('login', this.props.user)
    } else {
      console.log("State : ", AppState.currentState)
      this.props.socket.emit('logout', this.props.user)
    }
  }

  updateStatus = (onlineUsers) => {
    this.state.data.forEach(element => {
      if (onlineUsers.has(element.userId.userId)) {
        element.status = 'Online'
        element.socketId = onlineUsers.get(element.userId.userId).socketId
      } else {
        element.status = 'Offline'
        element.socketId = null
      }
    });
    this.setState({
      data: this.state.data
    })
  }

  Chat(userId, socketId, name) {
    console.log('Name: ', name)
    console.log('Socket id: ', socketId)
    this.props.navigation.navigate(Screens.Chat.route, { toUserId: userId, socketId: socketId, name: name })
  }

  componentDidMount() {

    this.appState()
    AppState.addEventListener('change', this.appState)

    this.props.socket.on('broadcast', data => {
      this.updateStatus(new Map(data))
    })

    this.props.socket.on('message', data => {
      console.log("Data: ",data)
      this.props.getChatList(this.props.user.id)
        .then(res => {
          console.log('Chat list: ', res.data)
          this.setState({
            data: res.data,
            fullData: res.data
          })
          this.props.socket.emit('broadcast')
        })
    })

    this.props.navigation.addListener('didFocus', () => {
      this.props.getChatList(this.props.user.id)
        .then(res => {
          console.log('Chat list: ', res.data)
          this.setState({
            data: res.data,
            fullData: res.data
          })
        })
    })
  }

  renderMessages = (messages, userId) => {
    console.log(messages)
    console.log(userId)
    let time;
    let message;
    for (let i = messages.length-1; i >= 0; i--) {
      if (messages[i].toUserId.userId == userId) {
        time = moment(new Date(messages[i].time)).format('HH:mm').toString()
        message = messages[i].message
        break;
      }
    }
    return {
      time: time,
      message: message
    }
  }

  handleSearch = text => {
    const formattedQuery = text.toLowerCase()
    const filteredData = _.filter(this.state.fullData, user => {
      return this.contains(user, formattedQuery)
    })
    console.log(filteredData)
    this.setState({ data: filteredData, query: text })
  }

  contains = ({ name }, query) => {
    if (name.toLowerCase().includes(query)) {
      return true
    }
    return false
  }

  render() {

    const { search } = this.state;
    return (
      <Container>

        <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <LoginBackIcon props={this.props} />
          </Left>
          <Body style={appStyles.rowXcenter}>
            <Title style={appStyles.titlewidth}>Messages</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid style={appStyles.content} bounces={false}>
          <View style={styles.searcharea}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" />
              <TextInput
                style={styles.input}
                placeholder="Search Users"
                onChangeText={this.handleSearch} />
            </View>
          </View>

          {this.props.isLoading ? <ActivityIndicator color={Colors.primary} size='large' /> : <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              let m = this.props.user ? this.renderMessages(item.content, this.props.user.id) : null;
              return (
                <ListItem avatar style={styles.listitem} >
                  <TouchableOpacity style={appStyles.listitemtouch} onPress={() => this.Chat(item.userId.userId, item.socketId, item.userId.name)}>

                    <Left>
                      <Thumbnail source={require('../../assets/images/man.jpg')} style={{ width: 50, }} />
                      <View style={item.status == 'Online' ? styles.symbolgreen : styles.symbolred} />
                    </Left>
                    <Body>
                      <Text>{item.userId.name}</Text>
                      <Text note>{m ? m.message : ''}</Text>
                    </Body>
                    <Right>
                      <Text note>{m ? m.time : ''}</Text>
                    </Right>
                  </TouchableOpacity>
                </ListItem>
              )
            }}
            keyExtractor={item => item.id}
          />}

        </Content>
        <Footer style={appStyles.customfooterBg}>
          <FooterIcon />
        </Footer>

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
    getChatList: (userId) => dispatch(userActions.getChatList({ userId: userId }))
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Messages {...props} socket={value.socket} /* notificationRef={value.notificationRef} */ />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);