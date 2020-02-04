import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  AsyncStorage,
  View,
} from 'react-native';
export default class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
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
				this.props.navigation.navigate('App');
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	storeData = async (key, value) => {
		//key and value are both strings
		try {
			await AsyncStorage.setItem(key, value)
		} catch (e) {
			// saving error
			console.log(e);
		}
	}
	
	login = () => {
		fetch('http://10.0.2.2:3000/signinUser', {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		})
		.then((response) => response.json())
		.then((res) => {
			if(res.success) {
				this.storeData("user", JSON.stringify(res.success));
				//This controls the switch navigator's state
				this.props.navigation.navigate('App');
			}

			else {
				alert(res.error);
			}
		})
		.done();
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.wrapper} behavior='padding'>
				<View style={styles.container}>
					<Text style={styles.header}>
						Login
					</Text>

					<TextInput style={styles.textInput} placeholder="Email"
						onChangeText={ (email)=> this.setState({email})}
						underlineColorAndroid='transparent'
					/>
					<TextInput style={styles.textInput} placeholder="Password"
						onChangeText={ (password)=> this.setState({password})}
						underlineColorAndroid='transparent'
						secureTextEntry={true}
					/>

					<TouchableOpacity
						style={styles.btn}
						onPress={this.login}
					>
					<Text>Log In</Text>
					</TouchableOpacity>

				</View>
			</KeyboardAvoidingView>
		);
	}
}

LoginScreen.navigationOptions = {
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
