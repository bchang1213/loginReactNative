import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
    TouchableOpacity,
	AsyncStorage,
    View,
} from 'react-native';
import Comments from '../components/Comments';
import { Video, Audio } from 'expo-av';

export default class VideoScreen extends React.Component {
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
			videoID: null,
			videoURI: '',
			videoTitle: ''
		};

		this.playbackInstance = null;
	}
	//Called Once on client
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
	//data is displayed to browser.
	componentDidMount () {
        this._loadInitialState().done();
		this.getVideos();

		Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid:          Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
		});
	 	//  This function will be called
		this._loadNewPlaybackInstance(true);
	}
	componentWillUnmount() {
		// this.playbackInstance.unloadAsync();
	//  Check Your Console To verify that the above line is working
		console.log('unmount');
	}
	/* Example focusedVideo JSON
	{
		"id":894,
		"name":"side control to Kimura technique",
		"uri":"/videos/291624955",
		"size640":{
		   "link":"https://i.vimeocdn.com/video/732859021_640x360.jpg?r=pad",
		   "width":640,
		   "height":360,
		   "link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F732859021_640x360.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"
		},
		"width":1280,
		"link":"https://player.vimeo.com/external/291624955.hd.mp4?s=54fff849faa4e6274661fcf8513d8af7a2bc0439&profile_id=174&oauth2_token_id=1285094569"
	 }
	 */
    _loadInitialState = async () => {
        try {
			var value = await AsyncStorage.getItem('user');
			var focusedVideo = await AsyncStorage.getItem('focusedVideo');
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
			
			if (focusedVideo !== null) {
				var focusedVideoJSON = JSON.parse(focusedVideo);

				this.setState({videoID: focusedVideoJSON.id});

				this.setState({videoURI: focusedVideoJSON.link});

				this.setState({videoTitle: focusedVideoJSON.name});

			}
			
        }
        catch (error) {
            console.log(error);
        }


	}
	
	async _loadNewPlaybackInstance(playing) {
		if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		 }
		 const source = JSON.stringify(this.state.videoURI);
		 const initialStatus = {
	//        Play by default
			  shouldPlay: true,
	//        Control the speed
			  rate: 1.0,
	//        Correct the pitch
			  shouldCorrectPitch: true,
	//        Control the Volume
			  volume: 1.0,
	//        mute the Audio
			  isMuted: false
		 };
		 const { sound, status } = await Audio.Sound.createAsync(
			 {uri: source},
			 {shouldPlay: initialStatus}
		);
	//  Save the response of sound in playbackInstance
		this.playbackInstance = sound;
	//  Make the loop of Audio
		this.playbackInstance.setIsLoopingAsync(true);
	//  Play the Music
		this.playbackInstance.playAsync();
	}

	getVideos = () => {
		// fetch('http://10.0.2.2:3000/getAllDBVideos', {
		// 	method: "GET",
		// 	headers: {
		// 		"Accept": "application/json",
		// 		"Content-Type": "application/json",
		// 	}
		// })
		// .then((response) => response.json())
		// .then((res) => {
		
		// 	if(res.success) {
        //         //Make videos available to component for display render.
        //         console.log("Type: " + JSON.stringify(res.success));
        //         this.setState({videos: res.success});
		// 	}

		// 	else {
		// 		alert("getVideos" + res.error);
		// 	}
		// })
		// .done();
    }
    
    goBack = () => {
		AsyncStorage.removeItem('focusedVideo');
        this.props.navigation.navigate('App');
    }

	handleVideoMount = ref => {
		this.player = ref;
	};

	render() {
		return (
			<View style={styles.container}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.goBack}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
				{this.state.videoTitle ?
				<Text
				style={styles.videoTitle}
				>
					{ this.state.videoTitle}
				</Text>
				: null }
				{this.state.videoID && this.state.videoURI ?
				<Video
				id={this.state.videoID}
				source={{ uri : this.state.videoURI }}
				rate={1.0}
				volume={1.0}
				isMuted={false}
				ref={this.handleVideoMount}
				useNativeControls={true}
				resizeMode="cover"
				style={{ width: 300, height: 200 }}
				/>
				: null}
				<Comments />
			</View>
		);
	}
}

VideoScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#3b3e40",
		paddingLeft: 40,
		paddingRight: 40,
		borderColor: "red"
    },
    videoTitle : {
        color: '#FFFFFF'
    },
    wrapper : {
        flex: 1,
    },
    videoCard: {
        backgroundColor: "#121212",
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
		marginTop: 10,
		height: 100
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