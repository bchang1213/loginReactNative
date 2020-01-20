import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	AsyncStorage,
	View,
} from 'react-native';

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: null,
			user_email: '',
			user_firstName: '',
			user_lastName: '',
			user_team: '',
			user_professor: '',
			user_username: '',
			user_role: 0
		};
	}

	componentDidMount () {
		this._loadInitialState().done();
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

	logOut = () => {
		alert("logging out");
		AsyncStorage.removeItem("user");
		this.props.navigation.navigate('Auth');
	}

	getVideos = () => {
		fetch('http://10.0.2.2:3000/getAllVimeos', {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
		})
		.then((response) => response.json())
		.then((res) => {
		
			if(res.success) {
				alert(JSON.stringify(res.success, null, 2));
			}

			else {
				alert(res.error);
			}
		})
		.done();
	}

	getOneVideo = () => {
		fetch('http://10.0.2.2:3000/getOneVimeo', {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
		})
		.then((response) => response.json())
		.then((res) => {
		
			if(res.success) {
				alert(JSON.stringify(res.success, null, 2));
			}

			else {
				alert(res.error);
			}
		})
		.done();
	}

	render() {
		return (
			<View style={styles.container} >
			{this.state.user_role === 1 ?
			<TouchableOpacity
				style={styles.btn}
				onPress={this.getVideos}
			>
				<Text>get Videos</Text>
			</TouchableOpacity>
			: null }
				<TouchableOpacity
					style={styles.btn}
					onPress={this.logOut}
				>
					<Text>Log Out</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

HomeScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
    wrapper : {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2896d3",
        paddingLeft: 40,
        paddingRight: 40
    },
    header : {
        fontSize: 24,
        marginBottom: 60,
        color: "#fff",
        fontWeight: "bold",
    },
    textInput: {
        alignSelf: "stretch",
        padding: 16,
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    btn: {
        alignSelf: "stretch",
        padding: 20,
        backgroundColor: "#01c853",
        alignItems: "center"
    }
});