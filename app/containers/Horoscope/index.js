import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList } from 'react-native'
import _ from 'lodash';
import { Layout, Colors, Screens, ActionTypes } from '../../constants';
import { Logo, Statusbar, Headers, Svgicon, LoginBackIcon, FooterIcon, ModalBox, InputBoxWithoutIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Spinner,
  Button, Tab, Tabs, Accordion,
  Text, Row, Col, Item, Input, List, ListItem, Form,
  Header, Left, Body, Title, Right, Footer, FooterTab, Thumbnail,
} from 'native-base';
import { connect, Field } from "react-redux";
import * as userActions from "../../actions/user";
import appStyles from '../../theme/appStyles';
import styles from './styles';
import { SearchBar } from 'react-native-elements';
import { Yesterdayfeed, todayfeed, tomorrowfeed } from './Data.js';

class Horoscope extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      yesterday: [],
      today: [],
      tomorrow: []
    }
  }

  horoscopeValues = (data) => {
    let day = []
    data.forEach(element => {
      day.push({ title: 'Aquarius', content: element.aquarius })
      day.push({ title: 'Aries', content: element.aries })
      day.push({ title: 'Cancer', content: element.cancer })
      day.push({ title: 'Capricorn', content: element.capricorn })
      day.push({ title: 'Gemini', content: element.gemini })
      day.push({ title: 'Leo', content: element.leo })
      day.push({ title: 'Libra', content: element.libra })
      day.push({ title: 'Pisces', content: element.pisces })
      day.push({ title: 'Sagittarius', content: element.sagittarius })
      day.push({ title: 'Scorpio', content: element.scorpio })
      day.push({ title: 'Taurus', content: element.taurus })
    });
    return day
  }

  componentDidMount() {
    this.props.horoscope()
      .then(res => {
        this.setState({
          yesterday: this.horoscopeValues(res.data.yesterday),
          today: this.horoscopeValues(res.data.today),
          tomorrow: this.horoscopeValues(res.data.tomorrow)
        })        
      }).catch(e => console.error(e))
  }

  render() {

    return (
      <Container>

        <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <LoginBackIcon props={this.props} />
          </Left>
          <Body style={appStyles.rowXcenter}>
            <Title style={appStyles.titlewidth}>Daily Horoscope</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid bounces={false}>

          <Tabs initialPage={1}>
            <Tab heading="Yesterday"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>
              <Accordion
                dataArray={this.state.yesterday}
                expanded={0}
                animation={true}
                activeTabStyle={{ color: '#ff0000' }}
                headerStyle={{ marginBottom: 1, backgroundColor: '#efefef', padding: 20, }}
                contentStyle={{ padding: 15, color: '#666666', fontSize: 16, lineHeight: 25, }}
              />
            </Tab>
            <Tab heading="Today"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>
              <Accordion
                dataArray={this.state.today}
                expanded={0}
                animation={true}
                headerStyle={{ marginBottom: 1, backgroundColor: '#efefef', padding: 20, }}
                contentStyle={{ padding: 15, color: '#666666', fontSize: 16, lineHeight: 25, }}
              />
            </Tab>
            <Tab heading="Tomorrow"
              activeTabStyle={{ backgroundColor: '#222222' }}
              tabStyle={{ backgroundColor: '#FFFFFF' }}>
              <Accordion
                dataArray={this.state.tomorrow}
                expanded={0}
                animation={true}
                headerStyle={{ marginBottom: 1, backgroundColor: '#efefef', padding: 20, }}
                contentStyle={{ padding: 15, color: '#666666', fontSize: 16, lineHeight: 25, }}
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
    horoscope: () => dispatch(userActions.getHoroscope()),
    logout: () => dispatch(userActions.logoutUser()),
  };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Horoscope);