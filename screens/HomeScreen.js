import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    FlatList,
	AsyncStorage,
	View,
} from 'react-native';
import { Video } from 'expo-av';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

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
            user_role: 0,
            videos: null
		};
	}
	//Called Once on client
	componentDidMount () {
		this._loadInitialState().done();
		this.getVideos();
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
	//data is displayed to browser.
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

	getVideos = () => {
		fetch('http://10.0.2.2:3000/getAllDBVideos', {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
		})
		.then((response) => response.json())
		.then((res) => {
		
			if(res.success) {
                //Make videos available to component for display render.
                console.log("Type: " + JSON.stringify(res.success));
                this.setState({videos: res.success});
			}

			else {
				alert("getVideos" + res.error);
			}
		})
		.done();
	}

	handleVideoMount = ref => {
		this.player = ref;
	};

	render() {
		return (
			<View style={styles.container}>
            { this.state.videos ?
                <FlatList
                data={this.state.videos}
                renderItem={({item}) =>
                    <Video
                    source={ require('./small.mp4') }
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    ref={this.handleVideoMount}
                    useNativeControls={true}
                    resizeMode="cover"
                    style={{ width: 300, height: 200 }}
                    />}
                />
            : null }
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
    },
	backgroundVideo: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	}
});