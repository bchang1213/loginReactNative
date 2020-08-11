import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    FlatList,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { openChat, sendMessage } from '../store';

class ConversationScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            messagePlaceHolder: 'Type a message',
            receiver: this.props.navigation.getParam('receivingUser')
        };
        this.send = this.send.bind(this);
        this.appendNewMessage = this.appendNewMessage.bind(this);
	}
	//Called Once on client
	componentDidMount () {
        openChat(this.props.user, this.state.receiver);
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
    //data is displayed to browser.
	componentWillUnmount() {
        this.setState({videos: null});
	}
    
    send(message) {
        console.log("Message: ", message[0], "userid: ", this.props.user.id, ", receiver: ", this.state.receiver.id, ", conversation id: ", this.props.messages[0]);
        sendMessage(message, message[0].text, this.props.user.id, this.state.receiver.id, this.props.messages[0]);
        this.appendNewMessage();
    }

    appendNewMessage() {
        if (this.props.recentlySent !== null && this.props.recentlySent !== undefined) {
            console.log("Hey, receently sent:", this.props.recentlySent);
        }
    }

    goBack = () => {
        this.props.navigation.navigate('Chat');
    }

	render() {
		return (
			<SafeAreaView style={styles.container}>
                <View style={styles.conversationTitle}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.goBack}
                    >
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.titleText}>{JSON.stringify(this.props.user)}</Text>
                    <Text style={styles.titleText}>({this.state.receiver.first_name} {this.state.receiver.last_name})</Text>
                    <Text style={styles.titleText}>convo id: {JSON.stringify(this.props.messages)}</Text> */}
                    {/* <Text style={styles.titleText}>messages json: {JSON.stringify(this.props.messages, null, 2)}</Text> */}
                    {/* <Text style={styles.titleText}>RECEIVER:{JSON.stringify(this.state.receiver)}</Text>
                    <Text style={styles.titleText}>USER: {JSON.stringify(this.props.user)}</Text>
                    <Text style={styles.titleText}>Messages: {JSON.stringify(this.props.messages)}</Text> */}
                </View>
                <GiftedChat
                    messages={ this.props.messages[1] }
                    user={{
                        _id: this.props.user.id,
                        name: this.props.user.username
                    }}
                    onSend={ message => this.send(message)}
                    scrollToBottom ={true}
                    alwaysShowSend ={true}
                    ref={ref => this.giftedChatRef = ref}
                    showAvatarForEveryMessage = {true}
                />
			</SafeAreaView>
		);
	}
}
/* Redux's this.props.user object is not explicitly used in this screen
because we are currently using AsyncStorage to do a "is the user signedin?" check.
later, when we implement Redux-Persist, this mapState function will be
crucial.*/
const mapState = (state, { navigation }) => ({
    user: state.user,
    messages: state.messages,
    recentlySent: state.messages.recentlySent
  });

ConversationScreen.navigationOptions = {
    header: null,
};

export default connect(mapState) (ConversationScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
        paddingTop: 30
    },
    conversationTitle: {
        
    },
    conversation : {
        backgroundColor: "#A9A9A9",
        flexGrow: 1,
    },
    flatList : {
        flexDirection: 'column-reverse'
    },
    chatContainer : {
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        flexWrap: 'nowrap'
    },
    messageBox : {

    },
    titleText: {
        color: "#FFFFFF",

    },
    btn: {
		alignSelf: "stretch",
		padding: 20,
		backgroundColor: "#01c853",
		alignItems: "center"
    },
    inputArea : {
        flexDirection: 'row'
    },
    textInput : {
        flexGrow: 2
    },
    submitMessage: {
		alignSelf: "stretch",
		padding: 5,
		backgroundColor: "#01c853",
        width: 20,
    },
    message : {
        color: '#FFFFFF'
    },
    userInfo : {
        color : '#FFFFFF'
    },
    userInfoBox : {

    },
});
