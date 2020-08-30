import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { ScreenOrientation } from 'expo';
import { DeviceMotion } from 'expo-sensors';
import Comments from '../components/Comments';
import { connect } from 'react-redux';
import { deleteFocus } from '../store';
import { Video, Audio } from 'expo-av';
import reducer from '../store/users';

class VideoScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		this.playbackInstance = null;
	}
	//Called Once on client
	/* Example focusedVideo JSON
	{
		"id":894,
		"name":"side control to Kimura technique",
		"uri":"/videos/29955",
		"size640":{
		   "link":"https://i.vimeocdn.com/video/732859360.jpg?r=pad",
		   "width":640,
		   "height":360,
		   "link_with_play_button":"https://i.vimeocdn.com/filter/overlay?src0=https%3A%%2Fi.vimeocdn.com%2Fvideo%2F7321_640x360.jpg&src1=http%3A%%2Ff.vimeocdn.com%2Fawler_play.png"
		},
		"width":1280,
		"link":"https://player.vimeo.com/external/291624955.hd.mp4?s=54ffaa4e19&id=174&oauth2_token_id=1269"
	 }
	 */
	componentDidMount () {
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

	/*componentWillMount is called twice: once on server,
	and once on client. It is called after initial render
	when client receives data from server and before the 
	data is displayed to browser.*/
	componentWillUnmount() {
	//  Check Your Console To verify that the above line is working
		console.log('unmount');
	}
	
	async _loadNewPlaybackInstance(playing) {
		if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		 }
		 const source = JSON.stringify(this.props.video.uri);
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
    
    goBack = () => {
		deleteFocus(this.props.navigation);
	}
	
	goQuiz = () => {
		this.props.navigation.navigate('Quiz');
    }

	handleVideoMount = ref => {
		this.player = ref;
	};


    _onFullscreenUpdate = ({fullscreenUpdate, status}) => {
        /* values of fullScreenUpdate
            0 -> FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT
            1 -> FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            2 -> FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS
            3 -> FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
        */

        //If the fullscreen updating is closing, then remove any listeners.
        // if (fullscreenUpdate === 3 || fullscreenUpdate === 2) {
        //     DeviceMotion.removeAllListeners();
        // }

        ScreenOrientation.unlockAsync();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)
        .catch(error => {});

        ////if the DeviceMotion api is available and the full screen is opening
        //if (DeviceMotion.isAvailableAsync() && fullscreenUpdate === 1) {
        //    DeviceMotion.addListener((listener) => {
        //        // {
        //        //   "acceleration": Object {
        //        //     "x": 0.000983891892246902,
        //        //     "y": 0.00334930419921875,
        //        //     "z": -0.0012129282113164663,
        //        //   },
        //        //   "accelerationIncludingGravity": Object {
        //        //     "x": 0.001967783784493804,
        //        //     "y": -9.803301811218262,
        //        //     "z": -0.0024258564226329327,
        //        //   },
        //        //   "orientation": 0,
        //        //   "rotation": Object {
        //        //     "alpha": -0.8989938497543335,
        //        //     "beta": NaN,
        //        //     "gamma": 0.8989896178245544,
        //        //   },
        //        //   "rotationRate": Object {
        //        //     "alpha": 0,
        //        //     "beta": 0,
        //        //     "gamma": 0,
        //        //   }
                
        //        //phone was rotated horizontally, right side landscape
        //        if (listener.orientation === 90) {
        //            console.log("rotated hor");
        //            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
        //            .catch(error => {});

        //        }

        //        //left landscape view
        //        if (listener.orientation === -90) {
        //            console.log("left landscape");
        //            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
        //            .catch(error => {});

        //        }

        //        //upside down orientation
        //        if (listener.orientation === 180) {
        //            console.log("upsidedown");
        //            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_DOWN)
        //            .catch(error => {});

        //        }

        //        //rightside up, vertical view
        //        if (listener.orientation === 0) {
        //            console.log("normal vertical view");
        //            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        //            .catch(error => {});

        //        }

        //    });
        //}

    };

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.btnContainer}>
					<TouchableOpacity
						style={styles.btn}
						onPress={this.goBack}
					>
						<Text>Prev. Lesson</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btn}
						onPress={this.goBack}
					>
						<Text>Back to Course Page</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btn}
						onPress={this.goBack}
					>
						<Text>Next Lesson</Text>
					</TouchableOpacity>
				</View>

				{this.props.video.id && this.props.video.link ?
				<Video
				id={this.props.video.id}
				source={{ uri : this.props.video.link  }}
				rate={1.0}
				volume={1.0}
				isMuted={false}
				ref={this.handleVideoMount}
				useNativeControls={true}
				resizeMode="contain"
                style={{ width: 300, height: 200 }}
                onFullscreenUpdate={this._onFullscreenUpdate}
				/>
				: null}

				{/* {!this.props.video.position_id ?
				<View style={styles.tagContainer}>
					<Text style={styles.tag}>Back</Text>
					<Text style={styles.tag}>Mount</Text>
					<Text style={styles.tag}>Guard</Text>
					<Text style={styles.tag}>Side Control</Text>
					<Text style={styles.tag}>Standing</Text>
					<Text style={styles.tag}>Passing</Text>
				</View>
				: null } */}

				{!this.props.video.position_id ?
				<View style={styles.tagContainer}>
					<Text style={styles.tag}>Back</Text>
					<Text style={styles.tag}>Mount</Text>
					<Text style={styles.tag}>Guard</Text>
					<Text style={styles.tag}>Side Control</Text>
					<Text style={styles.tag}>Standing</Text>
					<Text style={styles.tag}>Passing</Text>
				</View>
				: null }

				{this.props.video.name ?
				<Text
				style={styles.videoTitle}
				>
					{ this.props.video.name }
				</Text>
				: null }

				<Text style={styles.description}>
					{ this.props.video.description }
				</Text>

				<TouchableOpacity
						style={styles.quizButton}
						onPress={this.goQuiz}
					>
						<Text>Start Quiz</Text>
				</TouchableOpacity>

				<Comments />
			</SafeAreaView>
		);
	}
}

const mapState = (state) => ({
	user: state.user,
	video: state.focusPage
});

VideoScreen.navigationOptions = {
	header: null,
};

export default connect(mapState) (VideoScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: 'space-between',
		backgroundColor: "#3b3e40",
		borderColor: "red"
    },
    videoTitle : {
        color: '#FFFFFF'
	},
	tagContainer : {
		flex: 0.1,
		flexDirection: 'row',
		marginBottom: 10,
		marginTop: 10,
		backgroundColor: 'blue'
	},
	tag : {
		backgroundColor: "#FFFFFF",
		borderRadius: 40,
		padding: 4,
		width: 'auto',
		height: 30
	},
    wrapper : {

    },
    videoCard: {
		flex: 1,
        backgroundColor: "#121212",
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
		marginTop: 10,
		height: 100
	},

	description: {
		width: "80%",
	},

	textInput: {
		alignSelf: "stretch",
		padding: 16,
		marginBottom: 20,
		backgroundColor: "#fff"
	},

	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

    btn: {
		padding: 2,
		backgroundColor: "#01c853",
		margin: 10
	},

	quizButton: {
		padding: 2,
		backgroundColor: "#01c853",
	}
});
