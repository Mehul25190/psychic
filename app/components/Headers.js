import React from "react";
import { View, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { connect } from "react-redux";
import * as Animatable from 'react-native-animatable';

import {
  Button,
  Text,
  Header, Left, Body, Title, Right, Icon
} from 'native-base';

import appStyles from '../theme/appStyles';
import svgs from '../assets/svgs';
import { Colors, Layout, ActionTypes } from '../constants';
import Logo from './Logo';
import Svgicon from './Svgicon';
import * as userActions from "../actions/user";

import ModalBox from './ModalBox';
import SetLanguage from './SetLanguage';


class Headers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      toggle: true,
    }
  }
  render() {
    return (
      <Header transparent style={appStyles.headerbg}>
        <Left style={appStyles.row} />
        <Body style={appStyles.rowXcenter}>
          <TouchableWithoutFeedback onPress={() => this.props.showModal()}>
            <Logo header={true} />
          </TouchableWithoutFeedback>
        </Body>
        <Right style={appStyles.row}>
          <Button transparent onPress={() => {
            this.setState(prevState => ({ toggle: !prevState.toggle }))
            this.props.setLanguage(this.state.toggle ? 1 : 0)
          }}>
            {/* <Svgicon color={Colors.white} name="bell" /> */}
            <Icon type="FontAwesome" style={{ color: Colors.white }} name='language' />
            {/* <Svgicon color={Colors.white} name="language-sharp" /> */}
          </Button>
        </Right>
      </Header >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.auth.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: () => {
      dispatch({ type: ActionTypes.SHOWMODAL, showModal: true })
    },
    setLanguage: (value) => dispatch(userActions.setLanguage({ id: value, set: value })),
  };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Headers);