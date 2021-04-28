import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes, Strings } from '../../constants';
import { Logo, Statusbar, Headers, Svgicon, LoginBackIcon, FooterIcon, ModalBox, InputBoxWithoutIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button, Switch,
  Text, Row, Col, Item, Input, List, ListItem, Form,
  Header, Left, Body, Title, Right, Footer, FooterTab, Thumbnail,
} from 'native-base';
import { connect, Field } from "react-redux";
import * as userActions from "../../actions/user";
import appStyles from '../../theme/appStyles';
import styles from './styles';
import { SearchBar } from 'react-native-elements';
import SocketContext from '../Context/socket-context';


class Settings extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false
    }
  }

  componentDidMount() {
    this.props.socket.on('notification', data => {
      console.log('notification: ', data)
      if (data.payload.fromUserId != this.props.user.id) {
        this.props.notificationRef.current?.show()
      }
    })
  }

  logout() {
    this.props.logout();
    this.props.navigation.navigate(Screens.SignIn.route);
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
            <Title style={appStyles.titlewidth}>{Strings[this.props.languageId].settings}</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid bounces={false}>
          <ListItem icon onPress={() => this.props.navigation.navigate(Screens.PersonalInfo.route)}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon type='MaterialCommunityIcons' style={styles.iconSend} name='information-variant' />
              </Button>
            </Left>
            <Body>
              <Text>{Strings[this.props.languageId].personalInformation}</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.props.navigation.navigate(Screens.Package.route)}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon type='MaterialIcons' style={styles.iconSend} name='attach-money' />
              </Button>
            </Left>
            <Body>
              <Text>{Strings[this.props.languageId].topUpMyBalance}</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.props.navigation.navigate(Screens.Supports.route)}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon type='FontAwesome' style={styles.iconSend} name='support' />
              </Button>
            </Left>
            <Body>
              <Text>{Strings[this.props.languageId].support}</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.props.navigation.navigate(Screens.TermsService.route)}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon type='AntDesign' style={styles.iconSend} name='notification' />
              </Button>
            </Left>
            <Body>
              <Text>{Strings[this.props.languageId].termsOfServices}</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => {
            this.props.socket.emit('logout', this.props.user)
            this.logout()
          }}>
            <Left>
              <Button style={{ backgroundColor: "#d90746" }}>
                <Icon type='AntDesign' style={styles.iconSend} name='logout' />
              </Button>
            </Left>
            <Body>
              <Text>{Strings[this.props.languageId].logout}</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>


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
    languageId: state.auth.languageId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(userActions.logoutUser()),
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Settings {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);