import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity,} from 'react-native';
import { connect } from 'react-redux';
import { enteredConversation } from '../store';

class ChatScreen extends React.Component {
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

		this.goToConversation = this.goToConversation.bind(this);
	}

	componentDidMount () {
		console.log("Users: ", this.props);
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

	goToConversation = (receivingUser, index) => {
        
		this.props.navigation.navigate('Conversation', { receivingUser });
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.titleBar}>
					<Text>Messages</Text>
				</View>
				<FlatList
					data={this.props.users}
					keyExtractor = {item => item.id}
					style={styles.onlineCard}
					renderItem={({item, index}) =>
					<View>
						<TouchableOpacity
							onPress={(item, index) => this.goToConversation(item, index)}
							style={styles.eachUser}
						>
							<View style={styles.usernameBox}>
								<Text style={styles.userInfo} >{item.username} </Text>
							</View>
							<Text>{item.team}</Text>
						</TouchableOpacity>
						<View
							style={{
								height: 1,
								width: "86%",
								backgroundColor: "#CED0CE",
								marginLeft: "14%"
							}}
						>
						</View>
					</View>			
				}
				/>
			</SafeAreaView>
		);
	}

}

/* Redux's this.props.user object is not explicitly used in this screen
because we are currently using AsyncStorage to do a "is the user signedin?" check.
later, when we implement Redux-Persist, this mapState function will be
crucial.*/
//Filtering out the current user from amonst the 
const mapState = (state) => ({
    users: state.users.filter(user => user.id !== state.user.id)
  });

ChatScreen.navigationOptions = {
	header: null,
};

export default connect(mapState) (ChatScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: '#fff',
	},
	titleBar: {
		marginTop: 30,
		marginLeft: 20
	},
	onlineCard: {
		marginTop: 30,
		marginLeft: 20,

	},
	eachUser: {
		marginBottom: 5,

	},
	userInfo : {
		fontWeight: '700',
	},
	team: {
		fontSize: 10,
	}
});
