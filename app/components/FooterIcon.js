import React from "react";
import { StyleSheet, TouchableOpacity, View, ImageBackground, Image} from 'react-native'
import {
  Icon,
  Text,
  Button, Row, Col,
} from 'native-base';

import { Screens, ActionTypes, Strings } from '../constants';
import * as userActions from "../actions/user";
import { connect } from "react-redux";
import * as Animatable from 'react-native-animatable';
import { NavigationActions } from "react-navigation";
import appStyles from '../theme/appStyles';

class FooterIcon extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
    <Row>
      <Col>
        <TouchableOpacity style={appStyles.rowXcenter} onPress={() => this.props.Messages()}>
        <Icon type='AntDesign' style={appStyles.footericon} name='message1' /> 
        <Text style={appStyles.icontitle}>{Strings[this.props.languageId].messages}</Text>
        </TouchableOpacity>
      </Col>
      <Col>
        <TouchableOpacity style={appStyles.rowXcenter} onPress={() => this.props.Newsfeed()}>
        <Icon type='FontAwesome' style={appStyles.footericon} name='newspaper-o' /> 
        <Text style={appStyles.icontitle}>{Strings[this.props.languageId].newsFeed}</Text>
        </TouchableOpacity>
      </Col>
      <Col>
        <TouchableOpacity style={appStyles.rowXcenter} onPress={() => this.props.Home()}>
        <Image source={require('../assets/images/plusbutton.png')}  style={appStyles.footericonplus} />
        </TouchableOpacity>
      </Col>
      <Col>
        <TouchableOpacity style={appStyles.rowXcenter} onPress={() => this.props.Horoscope()}>
        <Icon type='FontAwesome' style={appStyles.footericon} name='moon-o' /> 
        <Text style={appStyles.icontitle}>{Strings[this.props.languageId].dailyHoroscope}</Text>
        </TouchableOpacity>
      </Col>
      <Col>
        <TouchableOpacity style={appStyles.rowXcenter} onPress={() => this.props.Settings()}>
        <Icon type='Feather' style={appStyles.footericon} name='settings' /> 
        <Text style={appStyles.icontitle}>{Strings[this.props.languageId].settings}</Text>
        </TouchableOpacity>
      </Col>
    </Row> 
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
      goBack: () => dispatch(NavigationActions.back()),
      Home: () => dispatch(NavigationActions.navigate({ routeName: Screens.Home.route })),
      Horoscope: () => dispatch(NavigationActions.navigate({ routeName: Screens.Horoscope.route })),
      Messages: () => dispatch(NavigationActions.navigate({ routeName: Screens.Messages.route })),
      Settings: () => dispatch(NavigationActions.navigate({ routeName: Screens.Settings.route })),
      Newsfeed: () => dispatch(NavigationActions.navigate({ routeName: Screens.Newsfeed.route }))
   };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(FooterIcon);