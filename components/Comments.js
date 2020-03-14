import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
    TouchableOpacity,
	AsyncStorage,
    View,
} from 'react-native';

export default class Comments extends React.Component {
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
	}
	//Called Once on client
	componentDidMount () {
        this._loadInitialState().done();
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
	//data is displayed to browser.
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
	
	submitComment = () => {
		console.log("VIDEO ID: ", this.state.videoID)
		var comment = this.state.comment;
		var video_id = this.state.videoID;
		var user_id = this.state.user_id;

		fetch('http://10.0.2.2:3000/saveComment', {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				comment: this.state.comment,
				video_id: this.state.videoID,
				user_id: this.state.user_id
			})
		})
		.then((response) => response.json())
		.then((res) => {
			if(res.success) {

			}

			else {
				alert(res.error);
			}
		})
		.done();
	}

	render() {
		return (
			<View style={styles.container}>
				<View>
					<Text>Comments</Text>
				</View>
				<View>
					<TextInput style={styles.textInput} placeholder="Leave a comment."
							onChangeText={ (text)=> this.setState({comment : text})}
							underlineColorAndroid='transparent'
					/>
					<TouchableOpacity
						style={styles.btn}
						onPress={this.submitComment}
					>
					<Text>Post</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#2896d3",
		paddingLeft: 40,
		paddingRight: 40
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