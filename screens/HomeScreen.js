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
			email: '',
			password: '',
		};
	}

	componentDidMount () {
		this._loadInitialState().done();
	}

	_loadInitialState = async () => {
		var value = await AsyncStorage.getItem('user');
		if (value === null) {
			//This Controls switch navigator's state
			// this.props.navigation.navigate('Auth');
		}
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

	render() {
		return (
			<View style={styles.container} >
				<TouchableOpacity
					style={styles.btn}
					onPress={this.getVideos}
				>
					<Text>get Videos</Text>
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