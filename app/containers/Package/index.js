import React from 'react'
import { StyleSheet, View, TouchableOpacity, ImageBackground, ScrollView, FlatList, Image } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes } from '../../constants';
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
        console.log('Package: ', res.data)
        this.setState({
          text: res.data.text,
          live: res.data.live,
        })
      }
      )
      .catch(e => console.error(e))
  }

  getToken = (packageId, amount, description) => {
    stripe.setOptions({
      publishableKey: 'pk_test_51HkBg1LgDtM6OJsOXCS4Cg6iyJspK9pMzZ2Qih4S7AqLlDXPChKpyefWAQfaKpKbyYD13YK7XXsOOugSGffySBRL00o9q4HYGo',
    })
    stripe.paymentRequestWithCardForm({}).then(res => {
      console.log('Token: ', res)
      this.props.payment(packageId, amount, res.tokenId, description, this.props.user.id)
        .then(response => {
          console.log('Response: ', response)
          if (response.data.status == 'success') {
            this.props.updateUser(response.data.data)
            this.props.loading(false)
            showToast('Payment successful.', 'success')
            this.props.navigation.navigate({ routeName: Screens.Home.route })
          } else {
            showToast('Error occured. Please try after some time.', 'danger')
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
                  <Icon type='Entypo' style={styles.topbaricons} name='message' /> {this.props.user ? this.props.user.text_credits : 0} TXT Credits
                </Text>
              </Col>
              <Col>
                <Text style={styles.headertitletext}>
                  <Icon type='Entypo' style={styles.topbaricons} name='message' /> {this.props.user ? this.props.user.live_credits : 0} LIVE Credits
                </Text>
              </Col>
            </Row>
          </View>



          <Tabs initialPage={0}>
            <Tab heading="Text Credit"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>

              <View>
                <Text style={styles.pagetitle}>You do not have enough text credits.</Text>
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
                          <Text note numberOfLines={1}>{item.desciption}</Text>
                          <Text>AUD {item.amount}</Text>
                        </Body>
                        <Right>
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.desciption)}>
                            <Text>Buy</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
              />



            </Tab>
            <Tab heading="Subscription"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>


              <View>
                <Text style={styles.pagetitle}>You do not have enough text credits.</Text>
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
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.desciption)}>
                            <Text>Buy</Text>
                          </Button>
                        </Right>
                      </ListItem>
                    </List>
                  </TouchableOpacity>
                }
                keyExtractor={item => item.id}
              />
            </Tab>
            <Tab heading="Live Credit"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>
              <View>
                <Text style={styles.pagetitle}>You do not have enough Live credits.</Text>
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
                          <Text note numberOfLines={5}>{item.desciption}</Text>
                          <Text>AUD {item.amount}</Text>
                        </Body>
                        <Right>
                          <Button rounded onPress={() => this.getToken(item.id, item.amount, item.desciption)}>
                            <Text>Buy</Text>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    package: () => dispatch(userActions.getPackage()),
    logout: () => dispatch(userActions.logoutUser()),
    payment: (packageId, amount, tokenId, description, userId) => dispatch(userActions.payment({
      amount: amount,
      tokenId: tokenId,
      description: description,
      package_id: packageId,
      user_id: userId
    })),
    updateUser: (data) => dispatch({
      type: ActionTypes.SIGNIN,
      data: data
    }),
    loading: (status) => dispatch({ type: ActionTypes.LOADING, isLoading: status })
  };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Package);