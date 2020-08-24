import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
    TouchableOpacity
} from 'react-native';
import Comments from '../components/Comments';
import { connect } from 'react-redux';
import { deleteFocus } from '../store';
import { Video, Audio } from 'expo-av';

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

	handleVideoMount = ref => {
		this.player = ref;
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.goBack}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>
				{this.props.video.name ?
				<Text
				style={styles.videoTitle}
				>
					{ this.props.video.name}
				</Text>
				: null }

				{this.props.video.id && this.props.video.link ?
				<Video
				id={this.props.video.id}
				source={{ uri : this.props.video.link  }}
				rate={1.0}
				volume={1.0}
				isMuted={false}
				ref={this.handleVideoMount}
				useNativeControls={true}
				resizeMode="cover"
				style={{ width: 300, height: 200 }}
				/>
				: null}

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
		justifyContent: 'flex-start',
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