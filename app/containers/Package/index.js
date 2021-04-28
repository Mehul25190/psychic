import React from 'react'
import { StyleSheet, View, TouchableOpacity, ImageBackground, ScrollView, FlatList, Image } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes, Strings } from '../../constants';
import { Logo, Svgicon, Headers, LoginBackIcon, FooterIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button, List, ListItem,
  Text, Toast, Row, Col, Tabs, Tab, Accordion,
  Header, Left, Body, Title, Right, Footer, FooterTab,
} from 'native-base';
import { connect } from "react-redux";
import * as userActions from "../../actions/user";
import appStyles from '../../theme/appStyles';
import styles from './styles';
import * as Animatable from 'react-native-animatable';
import { TextCredit, Subscription, LiveCredit } from './Data.js';
import stripe from 'tipsi-stripe';
import { showToast } from '../../utils/common';
import { NavigationActions } from 'react-navigation';
import SocketContext from '../Context/socket-context';

class Package extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      live: [],
    };
  }

  Messages() {
    this.props.navigation.navigate(Screens.Messages.route)
  }

  componentDidMount() {
    this.props.package()
      .then(res => {
        this.setState({
          text: res.data.text,
          live: res.data.live,
        })
      }
      )
      .catch(e => console.error(e))

    this.props.socket.on('notification', data => {
      console.log('notification: ', data)
      if (data.payload.fromUserId != this.props.user.id) {
        this.props.notificationRef.current?.show()
      }
    })
  }

  getToken = (packageId, amount, description) => {
    stripe.setOptions({
      publishableKey: 'pk_test_51HkBg1LgDtM6OJsOXCS4Cg6iyJspK9pMzZ2Qih4S7AqLlDXPChKpyefWAQfaKpKbyYD13YK7XXsOOugSGffySBRL00o9q4HYGo',
    })
    stripe.paymentRequestWithCardForm({}).then(res => {
      this.props.payment(packageId, amount, res.tokenId, description, this.props.user.id, this.props.user.name)
        .then(response => {
          console.log('Response: ', response)
          if (response.data.status == 'success') {
            this.props.updateUser(response.data.data)
            this.props.loading(false)
            showToast('Payment successful.', 'success')
            this.props.navigation.navigate({ routeName: Screens.Home.route })
          } else {
            showToast('Error occured. Please try after sometime.', 'danger')
          }
        }).catch(e => {
          console.log('ERROR: ', e);
          showToast('Error occured. Please try after some time.', 'danger')
        })
    })
  }

  render() {
    return (

      <Container>
        <Headers {...this.props} />
        <Content enableOnAndroid bounces={false}>
          <View style={styles.headertitle}>
            <Row>
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
            </Row>
          </View>



          <Tabs initialPage={0}>
            <Tab heading={Strings[this.props.languageId].textCredits}
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>

              <View>
                <Text style={styles.pagetitle}>{Strings[this.props.languageId].youDoNotHaveEnoughTextCredits}</Text>
              </View>
              <FlatList
                data={this.state.text}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                removeClippedSubviews={true}
                enableEmptySections={true}
                showsHorizontalScrollIndicator={false}
                legacyImplementation={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                  <TouchableOpacity>
                    <List>
                      <ListItem thumbnail>
                        <Left />
                        <Body>
                          <Text>{item.name}</Text>
                          <Text note numberOfLines={1}>{item.description}</Text>
                          <Text>AUD {item.amount}</Text>
                        </Body>
                        <Right>
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.description)}>
                            <Text>{Strings[this.props.languageId].buy}</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
              />



            </Tab>
            <Tab heading={Strings[this.props.languageId].subscriptions}
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>


              <View>
                <Text style={styles.pagetitle}>{Strings[this.props.languageId].youDoNotHaveEnoughTextCredits}</Text>
              </View>
              <FlatList
                data={Subscription}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                removeClippedSubviews={true}
                enableEmptySections={true}
                showsHorizontalScrollIndicator={false}
                legacyImplementation={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                  <TouchableOpacity>
                    <List>
                      <ListItem thumbnail>
                        <Left />
                        <Body>
                          <Text>{item.packagename}</Text>
                          <Text note numberOfLines={1}>{item.questions}</Text>
                          <Text>AUD {item.price}</Text>
                        </Body>
                        <Right>
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.questions)}>
                            <Text>{Strings[this.props.languageId].buy}</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
              />
            </Tab>
            <Tab heading={Strings[this.props.languageId].liveCredits}
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>
              <View>
                <Text style={styles.pagetitle}>{Strings[this.props.languageId].youDoNotHaveEnoughLiveCredits}</Text>
              </View>
              <FlatList
                data={this.state.live}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                removeClippedSubviews={true}
                enableEmptySections={true}
                showsHorizontalScrollIndicator={false}
                legacyImplementation={false}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                  <TouchableOpacity>
                    <List>
                      <ListItem thumbnail>
                        <Left />
                        <Body>
                          <Text>{item.name}</Text>
                          <Text note numberOfLines={5}>{item.description}</Text>
                          <Text>AUD {item.amount}</Text>
                        </Body>
                        <Right>
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.description)}>
                            <Text>{Strings[this.props.languageId].buy}</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
              />
            </Tab>
          </Tabs>

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
    package: () => dispatch(userActions.getPackage()),
    logout: () => dispatch(userActions.logoutUser()),
    payment: (packageId, amount, tokenId, description, userId, userName) => dispatch(userActions.payment({
      amount: amount,
      tokenId: tokenId,
      description: description,
      package_id: packageId,
      user_id: userId,
      name: userName
    })),
    updateUser: (data) => dispatch({
      type: ActionTypes.SIGNIN,
      data: data
    }),
    loading: (status) => dispatch({ type: ActionTypes.LOADING, isLoading: status })
  };
};

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <Package {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);