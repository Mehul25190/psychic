import React from 'react';
import { Dimensions, View, Text, SafeAreaView, StatusBar } from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';
import io from 'socket.io-client';
import { connect, Field } from "react-redux";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Colors, Screens } from '../../constants';
import Draggable from 'react-native-draggable';
import SocketContext from '../Context/socket-context';
import { showToast } from '../../utils/common';
import * as userActions from "../../actions/user";

const dimension = Dimensions.get('window')

class Call extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            localStream: null,
            remoteStream: null,
            audio: true,
            video: true,
            toSocketId: null,
            second: '00',
            minute: '00',
        }
        this.sdp
        this.socket = null;
        this.candidates = [];
    }

    updateCredit = (duration) => {
        this.props.usedCredit(this.props.user.id, ((Number(this.state.minute) + 1) * this.props.navigation.state.params.rate), duration);
      }

    timer = () => {
        setInterval(() => {
            let second = (Number(this.state.second) + 1).toString();
            let minute = this.state.minute
            if (Number(this.state.second) == 59) {
                minute = (Number(this.state.minute) + 1).toString();
                second = '00';
            }
            this.setState({
                second: second.length == 1 ? '0' + second : second,
                minute: minute.length == 1 ? '0' + minute : minute
            });
            if(minute >= this.props.navigation.state.params.allowedMinutes) {
                showToast('Please recharge credit balance to continue call.', 'danger')
                this.hangup();
            }
        }, 1000)
    }

    componentDidMount() {
        // this.timer()
        this.pc;
        this.props.navigation.addListener('didFocus', () => {
            const pc_config = {
                "iceServers": [{
                    urls: 'stun:stun.l.google.com:19302'
                }],
            };
            this.pc = new RTCPeerConnection(pc_config)
            if (this.props.navigation.state.params.sdp) {
                this.pc.setRemoteDescription(new RTCSessionDescription(this.props.navigation.state.params.sdp))
            }

            this.props.socket.on('candidate', data => {
                this.pc.addIceCandidate(new RTCIceCandidate(data))
            })

            this.props.socket.on('answer', data => {
                this.pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
                this.timer()
            })

            this.pc.onicecandidate = (e) => {
                if (e.candidate) {
                    console.log("Socket:", this.props.navigation.state.params.socketId)
                    this.props.socket.emit('candidate', e.candidate)
                    // this.sendToPeer('candidate', e.candidate, this.props.user, this.props.navigation.state.params.socketId)
                }
            }

            this.pc.oniceconnectionstatechange = (e) => {
                console.log(e)
            }

            this.pc.onaddstream = (e) => {
                console.log(e)
                this.setState({
                    remoteStream: e.stream
                })
                // this.remoteVideoRef.current.srcObject = e.stream
            }
        })

        const success = (stream) => {
            this.setState({
                localStream: stream
            })
            this.pc.addStream(stream)
            this.createOffer()
        }

        const failure = (error) => {
            console.log("Error : ", error)
        }

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            })
                .then(success)
                .catch(failure);
        });
    }

    sendToPeer = (message, payload, user, socketId) => {
        this.props.socket.emit(message, {
            socketId: {
                local: this.props.socket.id,
                remote: socketId
            },
            payload,
            user
        })
    }

    createOffer = () => {
        console.log("Offer")
        this.pc.createOffer({ offerToReceiveVideo: true, OfferToReceiveAudio: true })
            .then(sdp => {
                this.pc.setLocalDescription(sdp)
                this.sendToPeer('offer', sdp, this.props.user, this.props.navigation.state.params.socketId)
            }, e => console.log("Offer error: ", e))
    }

    createAnswer = (socketId) => {
        console.log("Answer")
        this.pc.createAnswer({ offerToReceiveVideo: true, OfferToReceiveAudio: true })
            .then(sdp => {
                this.pc.setLocalDescription(sdp)
                this.sendToPeer('answer', sdp, this.props.user, socketId)
            }, e => console.log("Answer error: ", e))
    }

    hangup = (duration) => {
        this.updateCredit(duration);
        this.setState({
            localStream: null,
            remoteStream: null
        })
        this.props.socket.emit('leave', this.props.navigation.state.params.socketId)
        this.pc.onicecandidate = null;
        this.pc.oniceconnectionstatechange = null;
        this.pc.onaddstream = null;
        this.pc.close()
        this.pc = null;
    }

    componentWillUnmount() {
        const duration = this.state.minute+':'+this.state.second;
        this.hangup(duration)
    }

    render() {
        const { localStream, remoteStream } = this.state
        const remoteVideo = remoteStream ?
            (<RTCView
                key={2}
                mirror={true}
                style={{ width: dimension.width, height: dimension.height }}
                objectFit="contain"
                streamURL={remoteStream && remoteStream.toURL()}
            />) :
            (<View><Text>Waiting for peer...</Text></View>)
        return (
            <View>
                <View style={{ flex: 1 }}>
                    <Draggable>
                        <View>
                            {this.state.video ? <RTCView
                                key={1}
                                zOrder={1}
                                objectFit='cover'
                                style={{ width: dimension.width * 0.35, height: dimension.height * 0.3, backgroundColor: 'black' }}
                                streamURL={localStream && localStream.toURL()}
                            /> : <RTCView
                                    key={1}
                                    zOrder={0}
                                    objectFit='cover'
                                    style={{ width: dimension.width * 0.35, height: dimension.height * 0.3, backgroundColor: 'black' }}
                                />}
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ margin: 10 }} onPress={() => {
                                    const audioTrack = localStream.getTracks().filter(track => track.kind === 'audio')
                                    audioTrack[0].enabled = !audioTrack[0].enabled
                                    this.setState({
                                        audio: audioTrack[0].enabled
                                    })
                                }}>
                                    <Text>{this.state.audio ? 'MUTE' : 'UNMUTE'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ margin: 10 }} onPress={() => {
                                    const videoTrack = localStream.getTracks().filter(track => track.kind == 'video')
                                    videoTrack[0].enabled = !videoTrack[0].enabled
                                    this.setState({
                                        video: videoTrack[0].enabled
                                    })
                                }}>
                                    <Text>{this.state.video ? 'OFF' : 'ON'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ margin: 10 }} onPress={() => localStream._tracks[1]._switchCamera()} >
                                    <Text>REVERSE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Draggable>
                    <View style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}>
                        <View style={{
                            width: dimension.width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: dimension.height
                        }}>
                            {remoteVideo}
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', alignContent: 'center' }}>
                        <View style={{
                            justifyContent: 'center',
                            zIndex: 1000,
                            alignItems: 'center',
                            backgroundColor: 'red',
                            height: dimension.height * 0.1 + StatusBar.currentHeight,
                            width: dimension.height * 0.1,
                            margin: 20,
                        }}>
                            <TouchableOpacity onPress={() => {
                                const duration = this.state.minute+':'+this.state.second;
                                this.hangup(duration)
                                this.props.user.is_psychic ?
                                    this.props.navigation.navigate(Screens.Messages.route) :
                                    this.props.navigation.navigate(Screens.Home.route)
                            }}>
                                <Text style={{ color: 'green' }}>
                                    HangUp
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ color: 'white' }}>
                                {this.state.minute} : {this.state.second}
                            </Text>
                        </View>
                    </View>
                    {this.props.user.is_psychic ? (
                        <View style={{ flex: 1, alignItems: 'flex-end', alignContent: 'flex-end' }}>
                            <View style={{
                                justifyContent: 'center',
                                zIndex: 1000,
                                alignItems: 'center',
                                backgroundColor: 'green',
                                height: dimension.height * 0.1 + StatusBar.currentHeight,
                                width: dimension.height * 0.1,
                                margin: 20,
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.createAnswer(this.props.navigation.state.params.toSocketId)
                                }}>
                                    <Text style={{ color: 'white' }}>
                                        Answer
                            </Text>

                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                    <View style={{
                        justifyContent: 'center',
                        zIndex: 1000,
                        alignItems: 'center',
                        backgroundColor: 'black',
                        padding: 10
                    }}>
                        <Text>
                            {this.state.minute} : {this.state.second}
                        </Text>
                    </View>
                </View>
            </View >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        usedCredit: (userId, credits, duration) => dispatch(userActions.creditUsed({
            user_id: userId,
            credits: credits,
            type: 'live', 
            duration: duration,
          })),
    };
};

const ConnectWithSocket = props => (
    <SocketContext.Consumer>
        {value => <Call {...props} socket={value.socket} notificationRef={value.notificationRef} />}
    </SocketContext.Consumer>
)

const options = {
    container: {
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        width: 220,
        top: 250,
    },
    text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithSocket);