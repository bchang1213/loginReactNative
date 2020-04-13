import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { login } from '../store';

class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
	}

	componentDidMount () {
		if (this.props.user.id) {
			//This Controls switch navigator's state
			this.props.navigation.navigate('App');
		}
	}

	loginSubmit = () => {
		login(this.state, this.props.navigation);
	}

	handleChange(type, value) {
		this.setState({ [type]: value });
	}

	render() {
		return (
			<KeyboardAvoidingView style={styles.wrapper} behavior='padding'>
				<View style={styles.container}>
					<Text style={styles.header}>
						Login
					</Text>

					<TextInput style={styles.textInput} placeholder="Email"
						onChangeText={ (email)=> this.handleChange('email', email)}
						underlineColorAndroid='transparent'
						returnKeyType='next'
						autoCorrect={ false }
						onSubmitEditing={ () => this.passwordInput.focus() }
					/>
					<TextInput style={styles.textInput} placeholder="Password"
						onChangeText={ (password)=> this.handleChange('password', password)}
						underlineColorAndroid='transparent'
						secureTextEntry={true}
						returnKeyType='go'
						autoCapitalize='none'
						ref={ input => this.passwordInput = input }
					/>

					<TouchableOpacity
						style={styles.btn}
						onPress={this.loginSubmit}
					>
					<Text>Log In</Text>
					</TouchableOpacity>

				</View>
			</KeyboardAvoidingView>
		);
	}
}

const mapState = (state) => ({
    user: state.user ? state.user : null
  });


LoginScreen.navigationOptions = {
  header: null,
};

export default connect(mapState) (LoginScreen);

const styles = StyleSheet.create({
	wrapper : {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3b3e40",
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
