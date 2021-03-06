import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity,} from 'react-native';
import { connect } from 'react-redux';

class ChatScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		this.goToConversation = this.goToConversation.bind(this);
	}

	componentDidMount () {
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
							onPress={() => this.goToConversation(item, index)}
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
	user: state.user,
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
