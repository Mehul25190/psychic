import React from 'react'
import { StyleSheet, TouchableOpacity, View, Animated, ImageBackground, TextInput, Image, TouchableHighlight, Alert, FlatList, Text } from 'react-native'
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
import SocketContext from '../Context/socket-context';

class TermsService extends React.Component {

  componentDidMount() {
    this.props.socket.on('notification', data => {
      console.log('notification: ', data)
      if (data.payload.fromUserId != this.props.user.id) {
        this.props.notificationRef.current?.show()
      }
    })
  }

  render() {
    return (
      <Container>

        <Header transparent style={appStyles.headerbg}>
          <Left style={appStyles.row}>
            <LoginBackIcon props={this.props} />
          </Left>
          <Body style={appStyles.rowXcenter}>
            <Title style={appStyles.titlewidth}>Terms of Services</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid bounces={false} style={styles.newsfeedbox}>

          <Text style={styles.termstitle}>
            RESTRICTIONS; COMPLIANCE WITH LAWS</Text>
          <Text style={styles.termscontent}>
            Your right to use the Web Site and the Services is personal to you. You are solely responsible for the contents of your transmissions through the App and your use of the Services is subject to all applicable local, state, national and international laws and regulations. By using the App or the Services, you agree:</Text>
          <Text style={styles.termscontent}>
            not to use the App or the Services for illegal purposes;
            not to interfere with or disrupt networks connected to the App;
to comply with all applicable regulations, laws, statutes, etc., regarding your use of the Services, including, but not limited to, laws and regulations relating to the use of the App or the Services to send electronic mail;</Text>
          <Text style={styles.termscontent}>
            not to use the App or the Services to send chain mail, junk mail, spamming or any use of distribution lists to any person who has not given specific permission for such use;</Text>
          <Text style={styles.termscontent}>
            not to use the App or the Services for the transmission of any unlawful, harassing, libelous, abusive, threatening, harmful, vulgar, or obscene material or communication of any kind or any nature;
not to interfere with any other user’s access to or use of the App or the Services.</Text>
          <Text style={styles.termscontent}>
            not to record or use any audio recording or retention devices/technology without the express written consent of Activepackets, Inc.
not to speak or act in a manner that is deemed by a psychic reader(s) to be inappropriate, abusive, or threatening.</Text>
          <Text style={styles.termscontent}>
            Wixnet reserves the right, in its sole discretion, to immediately terminate your access to and use of the Web Site or the Services without right to refund, for any violation of these Terms of Use.</Text>

          <Text style={styles.termscontent}>
            Important Note: It is a violation of our Terms of Use for you to be in direct contact with any of our psychics outside the online service or to ask any of our psychics for their direct contact information – if you do so in violation of these terms, Activepackets, Inc. bears no liability for any resulting actions, and your ability to use our services may be revoked. Any such activities in violation of our Terms of Use, may be reported to Activepackets, Inc. by our psychics and any such reports shall not be deemed a violation of our Privacy Policy.</Text>

          <Text style={styles.termstitle}>LINKS TO SPONSORS AND OTHER THIRD PARTY SITES </Text>
          <Text style={styles.termscontent}>Certain links on the App will let you leave the App. These linked sites, for example those of our sponsors, are not under the control of Wixnet, and Wixnet is not responsible for the contents of any linked site or any link contained in a linked site. These links are provided for your convenience, and the inclusion of any link does not imply a recommendation or endorsement by Wixnet of any such linked site or the products therein.</Text>

          <Text style={styles.termstitle}>INTELLECTUAL PROPERTY RIGHTS; INAPPROPRIATE USE OF APP</Text>
          <Text style={styles.termscontent}>The contents of the App, including, without limitation, all designs, text, graphics, other files, and the selection and arrangement thereof, are copyrighted and proprietary property. Wixnet hereby authorizes you to copy (electronically or in hard copy) materials published on the App or in print for non-commercial personal use only, provided that any copy of these documents which you make shall retain all copyright and other proprietary notices and any disclaimer contained on the documents. Except as expressly provided above, you may not otherwise copy, display, download, distribute, modify, reproduce, republish or retransmit any information, text or documents contained in the App or any portion thereof in any electronic medium or in hard copy, or create any derivative work based on such images, text or documents, without the express written consent of Wixnet. No information or statement contained in these Terms of Use or the App shall be construed as conferring, directly or by implication, estoppel, or otherwise, any license or right under any patent, copyright, trademark or other intellectual property right of Wixnet, its affiliates, or any third party. Wixnet may, at our discretion, limit or restrict the access and use of the App of any users who infringe the intellectual property rights in the manner described above.</Text>

          <Text style={styles.termstitle}>MATERIAL YOU SUBMIT </Text>
          <Text style={styles.termscontent}>You acknowledge that you are responsible for any submission you make (“Submissions”), including the legality, reliability, appropriateness, originality and copyright of any such material. You may not upload to, distribute, or otherwise publish through the App any content which is libelous, defamatory, obscene, threatening, invasive of privacy or publicity rights, abusive, illegal, or otherwise objectionable, or which may constitute or encourage a criminal offense, violate the rights of any party or otherwise give rise to liability or violate any law.</Text>

          <Text style={styles.termscontent}>Submissions shall be deemed to be non-confidential and non-proprietary. Wixnet shall have no obligation of any kind with respect to such Submissions and shall be free to reproduce, use, disclose, modify, display and distribute the Submissions to others without limitation. By transmitting such Submissions to Wixnet and the App, you automatically grant to Activepackets Inc. a perpetual, worldwide, royalty-free, irrevocable, non-exclusive right and license (with rights to sublicense) to use, reproduce, modify, adapt, publish, translate, edit and distribute such Submissions (in whole or in part) worldwide and/or to incorporate it in other works in any form, media or technology now known or hereafter developed for the full term of any copyright that may exist in such Submissions. You also permit any other user of Wixnet to access, view, store or reproduce the Submissions for that user’s personal use. Without limiting the generality of the foregoing license, if you send Submissions consisting of “testimonial” e-mails, you acknowledge that you grant Activepackets, Inc. the right to publicly display all or a part of such Submission on the Web Site or in any other format or media at any time.</Text>

          <Text style={styles.termscontent}>Please note that Wixnet does not want to receive Submissions containing confidential information from you and any Submissions received will be deemed NOT to be confidential. For purposes of this paragraph, “Submissions” shall not include personally identifiable information, which shall be treated by Wixnet in accordance with our Privacy Statement.</Text>

          <Text style={styles.termscontent}>This App (including, without limitation, text, photographs, graphics, video and audio content) is protected by copyright as a collective work or compilation under the copyright laws of the United States and other countries, and Activepackets, Inc., its subsidiaries and affiliates (subject to the rights of its licensors and licensees under applicable agreements, understandings and arrangements) have rights therein. All individual articles, videos, content and other elements comprising this Web Site are also copyrighted works, and Activepackets, Inc., its subsidiaries and affiliates (subject to the rights of its licensors and licensees under applicable agreements, understandings and arrangements) have rights therein. You must abide by all additional copyright notices or restrictions contained in this App. By posting or submitting content on or to the App (including the Blog, and regardless of the form or medium with respect to such content, whether text, videos, photographs, audio or otherwise), you are giving Activepackets, Inc, and its affiliates, agents and third party contractors the right to display or publish such content on the App and its affiliated publications (either in the form submitted or in the form of a derivative or adapted work, in our sole discretion), to store such content, and to distribute such content and use such content for promotional and marketing purposes. Without limiting the generality of the foregoing, with respect to any video submissions to the App made by you from time to time, you understand and agree that (unless you and we agree otherwise) we may, or may permit users to, based solely on functionality provided and enabled by the App, compile, re-edit, adapt or modify your Submission, or create derivative works therefrom, either on a stand-alone basis or in combination with other Submissions, and (unless you and we agree otherwise) you shall have no rights with respect thereto and Activepackets, Inc., its affiliates or its licensees shall be free to display and publish the same (as so compiled, re-edited, adapted, modified or derived) for any period.</Text>

          <Text style={styles.termscontent}>You shall be solely responsible for your own Submissions and the consequences of posting or publishing them. In connection with each of your Submissions, you affirm, represent, and/or warrant that: (i) you own or have the necessary licenses, rights, consents, and permissions to use and authorize Activepackets, Inc., its affiliates and subsidiaries to use all patent, trademark, trade secret, copyright or other proprietary rights in and to any and all such Submissions to enable inclusion and use of such Submissions in the manner contemplated by us and these Terms and Conditions; and (ii) you have the written consent, release, and/or permission of each and every identifiable individual person in such Submissions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of such Submissions in the manner contemplated by Activepackets, Inc. and these Terms and Conditions. In furtherance of the foregoing, you agree that you will not: (i) submit material that is copyrighted, protected by trade secret or otherwise subject to third party proprietary rights, including privacy and publicity rights, unless you are the owner of such rights or have permission from their rightful owner to post the material and to grant Activepackets, Inc. all of the rights granted herein; (ii) publish falsehoods or misrepresentations that could damage Activepackets, Inc., this Web Site or any third party; (iii) submit material that is unlawful, obscene, defamatory, libelous, threatening, pornographic, harassing, hateful, racially or ethnically offensive, or encourages conduct that would be considered a criminal offense, give rise to civil liability, violate any law, or is otherwise inappropriate; or (iv) post advertisements or solicitations of business.</Text>
          <Text style={styles.termscontent}>
            We may terminate your access to the App, without cause or notice, which may result in the forfeiture and destruction of all information associated with you. All provisions of this Agreement that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.


           </Text>

        </Content>
        <Footer style={appStyles.customfooterBg}>
          <FooterIcon />
        </Footer>

      </Container>

    );
  }
}

const ConnectWithSocket = props => (
  <SocketContext.Consumer>
    {value => <TermsService {...props} socket={value.socket} notificationRef={value.notificationRef} />}
  </SocketContext.Consumer>
)

// Exports
export default (ConnectWithSocket);