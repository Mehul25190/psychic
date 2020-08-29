import React from 'react'
import { StyleSheet, View, ImageBackground,SafeAreaView, TouchableWithoutFeedback} from 'react-native'
import _ from 'lodash'; 
import { NavigationActions } from 'react-navigation';
import {
  Container,
  Content,
  Icon,
  Text,
  Button,
  Form,
  Item,
  Label,
  Input,Header,
  Spinner, Row, Col
} from 'native-base';
import { connect } from "react-redux";
import { submit } from 'redux-form';
import * as Animatable from 'react-native-animatable';

import { Layout, Colors, Screens, ActionTypes } from '../../constants';
import { Logo, Statusbar, StatusBar, ModalBox, SetLanguage, Loader, AppIntro } from '../../components';
import imgs from '../../assets/images';
import * as userActions from "../../actions/user";
import { showToast } from '../../utils/common';
import appStyles from '../../theme/appStyles';
import styles from './styles';
import SignInForm from './form';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visibleModal: false,
    };
  }

  componentDidMount() {
    if(this.props.user!=null){
      this.props.navigation.navigate(Screens.SignInStack.route);
    }
    setTimeout(()=>{
      if(this.props.languageSet==0 && !this.props.showIntro){
        this.props.showModal();
      }
    },2000);
  }

  onSignupButtonPressHandler(){
    this.props.navigation.navigate(Screens.SignUp.route)
  }

  onForgotpasswordPressHandler(){
    this.props.navigation.navigate(Screens.ForgotPassword.route)
  }

  signin(values, dispatch, props){
    dispatch(userActions.signin(values))
      .then(res => {
        if(res.status == 200){
          showToast(res.msg,"success");
          dispatch(NavigationActions.navigate({ routeName: Screens.SignInStack.route }));
          // this.props.navigation.navigate(Screens.SignInStack.route)
        }else{
          showToast(res.msg,"danger");
        }
      })
      .catch(error => {
        const messages = _.get(error, 'response.data.error')
        message = (_.values(messages) || []).join(',')
        if (message){
         showToast(message,"danger");
       }
       console.log(`
          Error messages returned from server:`, messages )
      });
  }

  render(){
    const { language } = this.props;

    if(this.props.user==null){
      // Login 
      return (

        <Container>
       <ImageBackground 
              source={imgs.bg} 
              style={ { width: Layout.window.width, height: Layout.window.height }}>
        <Content enableOnAndroid bounces={false}>

                  <View style={appStyles.rowXcenter}>
                    <TouchableWithoutFeedback onPress={() => this.props.resetState()}>
                      <Logo style={appStyles.loginLogo} />
                    </TouchableWithoutFeedback >
                  </View> 
                <View style={styles.loginboxarea}>
                  <View style={appStyles.rowXcenter}>
                      <Text style={styles.loginwelcome}>Welcome!</Text>
                  </View>
                   <Animatable.View 
                    animation="fadeInUp"
                    delay={500}
                    style={styles.loginBox}>
                    <SignInForm onSubmit={this.signin} />                    
                  </Animatable.View>

                    <Row>
                      <Col />
                      <Col>
                        <Animatable.View 
                    animation="fadeIn"
                    delay={1000} 
                    style={[styles.loginbutton,{justifyContent:'center'}]}> 
                  { this.props.isLoading ? 
                     <Spinner color={Colors.secondary} /> : 
                      <Button
                        full
                        primary
                        style={[appStyles.btnSecontary, styles.loginbuttontext, {justifyContent:'center'}]}
                        onPress={() => this.props.pressSignin()}
                      >
                        <Text style={styles.logintext}> Login </Text>
                      </Button>
                  }
                </Animatable.View> 
                      </Col>
                      <Col />
                    </Row>
                  

                  <Row>
                      <Col>
                        <Button transparent full  
                          onPress={() => this.onForgotpasswordPressHandler()}
                          style={[styles.linkTextBtn,{justifyContent:'center'}]}>
                          <Text style={styles.linkText}> Forgot your password? </Text>
                        </Button>
                      </Col>
                    </Row>
              </View>
                <ModalBox 
                visibleModal={this.state.visibleModal}
                content={<SetLanguage />} 
                style={appStyles.bottomModal}
                contentStyle={appStyles.setLanguage}
                />    

        </Content>
        
           </ImageBackground>
      </Container>

      );
    }else{
      // Authendicating
      return (<Loader />);
    }
  }
}
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    isLoading: state.common.isLoading,
    user: state.auth.user,
    language: state.auth.language,
    languageSet: state.auth.languageSet || 0,
  };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  // Action
    return {
      pressSignin: () => dispatch(submit('signinForm')),
      showModal: () => dispatch({ type: ActionTypes.SHOWMODAL, showModal: true }),
      resetState: () => dispatch({ type: ActionTypes.RESETSTATE })
   };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
