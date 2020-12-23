import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList, Linking } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes } from '../../constants';
import { Logo, Statusbar, Headers, Svgicon, LoginBackIcon, FooterIcon, ModalBox, InputBoxWithoutIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button, Card, CardItem,
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

class Newsfeed extends React.Component {


  NewsDetail(url) {
    // this.props.navigation.navigate(Screens.NewsDetail.route)
    Linking.openURL(url)
  }

  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      data: [],
    }
  }

  componentDidMount() {

    this.props.newsfeed()
      .then(res => {
        this.setState({
          data: res.data
        })
      })
    this.props.socket.emit('notification')

    socket.on('notification', data => {
      console.log(data)
      this.props.notificationRef.current?.show();
    })
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
            <Title style={appStyles.titlewidth}>News Feed</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid bounces={false}>

          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) =>
              <Card style={styles.newsfeedbox}>
                <View>
                  <TouchableOpacity style={appStyles.listitemtouch} onPress={() => this.NewsDetail()}>
                    <Image source={{ uri: item.image }} style={styles.mainimage} />
                  </TouchableOpacity>

                  <TouchableOpacity style={appStyles.listitemtouch} onPress={() => this.NewsDetail()}>
                    <Text style={styles.newstitle}>{item.title}</Text>
                  </TouchableOpacity>

                  <Text style={styles.newscontent} note>{item.description}</Text>
                </View>
                <View>
                  <Button transparent>
                    <Text>{item.date.split(" ")[0]}</Text>
                    <Text onPress={() => this.NewsDetail(item.url)}>Continue Reading</Text>
                  </Button>
                </View>
              </Card>
            }
            keyExtractor={item => item.id}
          />

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(userActions.logoutUser()),
    newsfeed: () => dispatch(userActions.newsFeed()),
  };
};

const ConnectionWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Newsfeed {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectionWithSocket);