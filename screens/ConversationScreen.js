import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    FlatList,
	AsyncStorage,
    View,
    Image
} from 'react-native';
import { connect } from 'react-redux';

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

	render() {
		return (
			<View style={styles.container}>
                <Text>CHAT REACHED</Text>
			</View>
		);
	}
}
/* Redux's this.props.user object is not explicitly used in this screen
because we are currently using AsyncStorage to do a "is the user signedin?" check.
later, when we implement Redux-Persist, this mapState function will be
crucial.*/
const mapState = (state) => ({
    user: state.user
  });

ConversationScreen.navigationOptions = {
    header: null,
};

export default connect(mapState) (ConversationScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#3b3e40",
		paddingLeft: 40,
        paddingRight: 40
    }
});