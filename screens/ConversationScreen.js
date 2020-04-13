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
import { openChat, sendMessage } from '../store';

class ConversationScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            messagePlaceHolder: 'Type a message',

        };

	}
	//Called Once on client
	componentDidMount () {
        openChat(this.props.user, this.props.receiver);
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
    //data is displayed to browser.
	componentWillUnmount() {
        this.setState({videos: null});
	}
    
    send(message) {
        sendMessage(message.text, this.props.user, this.props.receiver);
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
                    <Text style={styles.titleText}>{this.props.receiver.username}</Text>
                    <Text style={styles.titleText}>({this.props.receiver.first_name} {this.props.receiver.last_name})</Text>
                    {/* <Text style={styles.titleText}>RECEIVER:{JSON.stringify(this.props.receiver)}</Text>
                    <Text style={styles.titleText}>USER: {JSON.stringify(this.props.user)}</Text>
                    <Text style={styles.titleText}>Messages: {JSON.stringify(this.props.messages)}</Text> */}
                </View>
                <View style={styles.conversation}>
                    <FlatList
                    style={styles.flatList}
                        data={this.props.messages}
                        keyExtractor = {item => item.id}
                        contentContainerStyle={styles.chatContainer}
                        renderItem={({item, index}) =>
                            <View style={styles.messageBox}>
                                <View style={styles.userInfoBox}>
                                    <Text style={styles.userInfo}>{item.username}</Text>
                                </View>
                                <Text style={styles.message} >{item.text}</Text>
                            </View>
                        }
                    />
                </View>
                <View style={styles.inputArea}>
                    <TextInput style={styles.textInput} placeholder={this.state.messagePlaceHolder}
                        ref={input => { this.textInput = input }}
                        onChangeText={ (text)=> this.startComment(text)}
                        underlineColorAndroid='transparent'
                    />
                    <TouchableOpacity
                        style={styles.submitMessage}
                        onPress={this.submitComment}
                    >
                        <Text>></Text>
                    </TouchableOpacity>
                </View>
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
    receiver: navigation.getParam('receivingUser'),
    messages: state.messages
  });

ConversationScreen.navigationOptions = {
    header: null,
};

export default connect(mapState) (ConversationScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
		paddingLeft: 40,
        paddingRight: 40,
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