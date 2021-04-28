import React from 'react'
import { StyleSheet, View, TouchableOpacity, ImageBackground, ScrollView, FlatList, Image, AppState, ActivityIndicator } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes, Strings } from '../../constants';
import { Logo, Svgicon, Headers, LoginBackIcon, FooterIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button,
  Text, Toast, Row, Col,
  Header, Left, Body, Title, Right, Footer, FooterTab, Tab, Tabs, ScrollableTab
} from 'native-base';
import { connect } from "react-redux";
import * as userActions from "../../actions/user";
import appStyles from '../../theme/appStyles';
import styles from './styles';
import * as Animatable from 'react-native-animatable';
import { MypropertiesData } from './Data.js';
import SocketContext from '../Context/socket-context';
import { RTCPeerConnection } from 'react-native-webrtc';
import storage from '../../utils/storage';
import { showToast } from '../../utils/common';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      category: [],
      psychic: [],
      all: [],
    };
  }

  shuffleArray = (array) => {
    let len = array.length;
    let temp;
    while (len > 0) {
      let index = Math.floor(Math.random() * len);
      len--;
      temp = array[len];
      array[len] = array[index]
      array[index] = temp
    }
    return array;
  }

  updateStatus = (array, onlineUsers, isAll) => {
    let users = array
    users.forEach(element => {
      if (onlineUsers.has(element.id)) {
        element.status = 'Online'
        element.socketId = onlineUsers.get(element.id).socketId
      } else {
        element.status = 'Offline'
        element.socketId = null
      }
    });
    isAll ? this.setState({
      all: users
    }) :
      this.setState({
        psychic: users
      })
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

  componentDidMount() {

    if (this.props.user) {
      this.props.psychicCategoryList()
        .then(res => {
          this.props.psychicList(res.data[0].id)
            .then(r => {
              let temp = this.shuffleArray(r.all.data)
              this.setState({
                psychic: r.categoryWise.data,
                category: res.data,
                all: temp
              })
              this.props.socket.emit('broadcast')
            }).catch(e => console.error(e))
        }).catch(e => console.error(e))

      this.props.socket.on('broadcast', data => {
        this.updateStatus(this.state.psychic, new Map(data), false)
        this.updateStatus(this.state.all, new Map(data), true)
      })
    }

    this.props.socket.on('notification', data => {
      if (data.payload.fromUserId != this.props.user.id) {
        this.props.notificationRef.current?.show()
      }
    })

    if (this.props.user && this.props.user.is_psychic) {
      this.props.navigation.navigate(Screens.Messages.route)
      this.props.socket.on('offer', data => {
        this.props.navigation.navigate(Screens.Call.route, { toSocketId: data.socketId, sdp: data.sdp })
      })
    }

    if (this.props.user == null) {
      this.props.navigation.navigate(Screens.SignIn.route)
    } else {
      this.appState()
      AppState.addEventListener('change', this.appState)
    }
  }

  Messages(socketId, toUserId, name, textRate, profileImagePath) {
    const allowedText = this.props.user.text_credits / textRate;
    this.props.navigation.navigate(Screens.Chat.route, { socketId: socketId, toUserId: toUserId, name: name, allowedText: allowedText, rate: textRate, profileImagePath: profileImagePath })
  }

  Call(socketId, liveRate) {
    const allowedMinutes = this.props.user.live_credits / liveRate;
    if (allowedMinutes > 0) {
      this.props.navigation.navigate(Screens.Call.route, { socketId: socketId, allowedMinutes: allowedMinutes, rate: liveRate })
    } else {
      showToast('You do not have sufficient credit to make call', 'danger')
    }
  }

  render() {
    return (

      <Container>
        <Headers {...this.props} />
        <Content enableOnAndroid bounces={false}>
          <View style={styles.headertitle}>
            {this.props.user && this.props.user.is_psychic == 1 ? null : <Row>
              <Col>
                <Text style={styles.headertitletext}>
                  <Icon type='Entypo' style={styles.topbaricons} name='message' /> {this.props.user ? this.props.user.text_credits : 0} {Strings[this.props.languageId].textCredits}
                </Text>
              </Col>
              <Col>
                <Text style={styles.headertitletext}>
                  <Icon type='Entypo' style={styles.topbaricons} name='message' /> {this.props.user ? this.props.user.live_credits : 0} {Strings[this.props.languageId].liveCredits}
                </Text>
              </Col>
            </Row>}
          </View>

          <View>
          {/* <Text style={styles.pagetitle}>{this.props.languageId}</Text> */}
            <Text style={styles.pagetitle}>{Strings[this.props.languageId].featured}</Text>
          </View>

          <FlatList
            data={this.state.category}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={true}
            removeClippedSubviews={true}
            enableEmptySections={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) =>
              <TouchableOpacity onPress={() => {
                // this.setState({ psychic: [] })
                this.props.psychicList(item.id)
                  .then(res => {
                    let temp = this.shuffleArray(res.all.data)
                    this.setState({
                      psychic: res.categoryWise.data,
                      all: temp
                    })
                    this.props.socket.emit('broadcast')
                  }
                  ).catch(e => console.log(e))
              }}>
                <View style={{ borderColor: 'black', borderRadius: 5, borderWidth: 1, margin: 5, padding: 5 }}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            }
            style={{ padding: 10 }}
          />


          {this.props.isLoading ? <ActivityIndicator color={Colors.primary} size='large' /> : <FlatList
            data={this.state.psychic}
            contentContainerStyle={styles.scrollViewStyle}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={true}
            removeClippedSubviews={true}
            enableEmptySections={true}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            style={styles.contentsection}
            renderItem={({ item }) =>
              <TouchableOpacity /* onPress={() => this.ViewRoute()} */ style={styles.boxcontentareagrid}>
                <View>
                  <View style={styles.filtericon}>
                    <Image source={{ uri: item.profile_img_path }} style={styles.imagesection} />
                  </View>
                  <View style={styles.contentspacingtext}>
                    <View style={[item.status == 'Online' ? styles.symbolgreen : styles.symbolred]} />
                    <Text style={styles.datetitle}>{item.name}</Text>
                    {/* <Text style={styles.positiontitle}>{item.position}</Text> */}
                    <Text style={styles.pricetitle}>{item.live_rate} {Strings[this.props.languageId].crPerMin}</Text>
                    <Text style={styles.pricetitle}>{item.text_rate} {Strings[this.props.languageId].crPerMsg}</Text>
                    <Row>
                      <Col>
                        <TouchableOpacity style={styles.livechat} onPress={() => item.status == 'Online' ? this.Call(item.socketId, item.live_rate) : showToast(item.name+' is offline, can not make call', 'danger')}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].liveChat}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.livetext} onPress={() => this.Messages(item.socketId, item.id, item.name, item.text_rate, item.profile_img_path)}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].liveChat}</Text>
                        </TouchableOpacity> */}
                      </Col>
                      <Col>
                        <TouchableOpacity style={styles.livetext} onPress={() => this.Messages(item.socketId, item.id, item.name, item.text_rate, item.profile_img_path)}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].text}</Text>
                        </TouchableOpacity>
                      </Col>

                    </Row>
                  </View>
                </View>
              </TouchableOpacity>}
          />}

          <View>
            <Text style={styles.pagetitle}>{Strings[this.props.languageId].psychicForYou}</Text>
          </View>

          {this.props.isLoading ? <ActivityIndicator color={Colors.primary} size='large' /> : <FlatList
            data={this.state.all}
            style={styles.contentsection}
            renderItem={({ item }) =>
              <TouchableOpacity /* onPress={() => this.ViewRoute()} */ style={styles.boxcontentareagrid}>
                <View>
                  <View style={styles.filtericon}>
                    <Image source={{ uri: item.profile_img_path }} style={styles.imagesection} />
                  </View>
                  <View style={styles.contentspacingtext}>
                    <View style={[item.status == 'Online' ? styles.symbolgreen : styles.symbolred]} />
                    <Text style={styles.datetitle}>{item.name}</Text>
                    {/* <Text style={styles.positiontitle}>{item.position}</Text> */}
                    <Text style={styles.pricetitle}>{item.live_rate} {Strings[this.props.languageId].crPerMin}</Text>
                    <Text style={styles.pricetitle}>{item.text_rate} {Strings[this.props.languageId].crPerMsg}</Text>
                    <Row>
                      <Col>
                        <TouchableOpacity style={styles.livechat} onPress={() => item.status == 'Online' ? this.Call(item.socketId, item.live_rate) : showToast(item.name+' is offline, can not make call', 'danger')}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].liveChat}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.livetext} onPress={() => this.Messages(item.socketId, item.id, item.name, item.text_rate, item.profile_img_path)}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].liveChat}</Text>
                        </TouchableOpacity> */}
                      </Col>
                      <Col>
                        <TouchableOpacity style={styles.livetext} onPress={() => this.Messages(item.socketId, item.id, item.name, item.text_rate, item.profile_img_path)}>
                          <Text style={styles.iconstitle}>{Strings[this.props.languageId].text}</Text>
                        </TouchableOpacity>
                      </Col>

                    </Row>
                  </View>
                </View>
              </TouchableOpacity>}
            numColumns={2}
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
    languageId: state.auth.languageId || 0,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    psychicList: (categoryId) => dispatch(userActions.getPsychicList({
      category_id: categoryId
    })),
    psychicCategoryList: () => dispatch(userActions.getPsychicCategory()),
    logout: () => dispatch(userActions.logoutUser()),
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Home {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);