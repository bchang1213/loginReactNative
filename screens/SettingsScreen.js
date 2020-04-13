import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	AsyncStorage,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { logOut } from '../store';

class SettingsScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount () {
	}

	logOut = () => {
		alert("logging out");
		logOut(this.props.navigation);
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
				alert("Success to getting all videos.");
			}

			else {
				alert("Error occurred.");
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
				alert(res.success);
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
			{this.props.user.user_role === 1 ?
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

const mapState = (state) => ({
    user: state.user,
    focusPage: state.focusPage
});

SettingsScreen.navigationOptions = {
	header: null,
};

export default connect(mapState) (SettingsScreen);

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