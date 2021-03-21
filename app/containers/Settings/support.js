  import React from 'react'
import { Text} from 'react-native'
import _ from 'lodash'; 
import { Layout, Colors, Screens, ActionTypes } from '../../constants';
import { Logo, Statusbar, Headers, Svgicon, LoginBackIcon, FooterIcon, ModalBox, InputBoxWithoutIcon } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,

  Header, Left, Body, Title, Right, Footer,
} from 'native-base';

import appStyles from '../../theme/appStyles';
import styles from './styles';


class Supports extends React.Component {

  
  render(){
    return (
      <Container>

            <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <LoginBackIcon props={this.props} /> 
          </Left>
          <Body style={appStyles.rowXcenter}>
            <Title style={appStyles.titlewidth}>Support</Title>
          </Body>
          <Right/>
        </Header>
        <Content enableOnAndroid bounces={false}>

<Text style={styles.termstitle}>Email Address:</Text>
<Text style={styles.termscontent}>support@wixnet.net</Text>

<Text style={styles.termstitle}>Phone Number:</Text>
<Text style={styles.termscontent}>+6(234)-786-4639</Text>

           
        </Content>
        <Footer style={appStyles.customfooterBg}>
          <FooterIcon />
        </Footer>
        
      </Container>
     
    );
  }
}

// Exports
export default (Supports);