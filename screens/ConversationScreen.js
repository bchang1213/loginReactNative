import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
	AsyncStorage,
    View,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-elements';

class ConversationScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            user: null,
			user_id: null,
			user_email: '',
			user_firstName: '',
			user_lastName: '',
			user_team: '',
			user_professor: '',
			user_username: '',
            user_role: 0,
            videos: null
        };

	}
	//Called Once on client
	componentDidMount () {
        this._loadInitialState().done();
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
    //data is displayed to browser.
	componentWillUnmount() {
        this.setState({videos: null});
	}
    _loadInitialState = async () => {
        try {
            var value = await AsyncStorage.getItem('user');
            if (value !== null) {
                //This Controls switch navigator's state
                var userJSON = JSON.parse(value);
                this.setState({user_id: userJSON.id});
                this.setState({user_email: userJSON.email});
                this.setState({user_firstName: userJSON.first_name});
                this.setState({user_lastName: userJSON.last_name});
                this.setState({user_team: userJSON.user_team});
                this.setState({user_professor: userJSON.professor});
                this.setState({user_username: userJSON.username});
                this.setState({user_role: userJSON.user_role});
            }
        }
        catch (error) {
            console.log(error);
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
                    <Text style={styles.titleText}>{this.props.receiver.username}</Text>
                    <Text style={styles.titleText}>({this.props.receiver.first_name} {this.props.receiver.last_name})</Text>
                    <Text style={styles.titleText}>{JSON.stringify(this.props.receiver)}</Text>
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
    receiver: navigation.getParam('receivingUser')
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