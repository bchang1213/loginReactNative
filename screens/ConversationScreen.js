import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    SafeAreaView,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { openChat, sendMessage } from '../store';

class ConversationScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
                    <Text style={styles.titleText}>RECEIVER:{JSON.stringify(this.props.receiver)}</Text>
                    <Text style={styles.titleText}>USER: {JSON.stringify(this.props.user)}</Text>
                    <Text style={styles.titleText}>Messages: {JSON.stringify(this.props.messages)}</Text>
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
		alignItems: "center",
		backgroundColor: "#000000",
		paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 30
    },
    conversationTitle: {
        
    },
    titleText: {
        color: "#FFFFFF",

    },
    btn: {
		alignSelf: "stretch",
		padding: 20,
		backgroundColor: "#01c853",
		alignItems: "center"
	}
});