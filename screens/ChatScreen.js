import React from 'react';
import { View, StyleSheet, Text, } from 'react-native';

export default class ChatScreen extends React.Component {
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

	componentDidMount () {
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
				<Text>Hello</Text>
			</View>
		);
	}

}

ChatScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: '#fff',
	},
});
