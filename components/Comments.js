import React from 'react';
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
	ScrollView,
	AsyncStorage,
	Text,
    View,
} from 'react-native';
import { List, ListItem } from "react-native-elements";

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
			videoTitle: '',
			comments: null,
			comment: '',
			commentPlaceHolder: "Leave a comment"
		};

		this.submitComment = this.submitComment.bind(this);
	}
	//Called Once on client
	componentDidMount () {
		this._loadInitialState().done();
	}
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
				console.log("User name deteced: ", userJSON.username);
                this.setState({user_username: userJSON.username});
				this.setState({user_role: userJSON.user_role});
			}
			
			if (focusedVideo !== null) {
				var focusedVideoJSON = JSON.parse(focusedVideo);

				this.setState({videoID: focusedVideoJSON.id});

				this.setState({videoURI: focusedVideoJSON.link});

				this.setState({videoTitle: focusedVideoJSON.name});
				/*getComments requires videoID, so make sure videoID state is set before running */
				this.getComments();

			}
        }
        catch (error) {
            console.log(error);
        }
	}
	
	getComments = () => {
		fetch('http://10.0.2.2:3000/getAllCommentsForVideoID', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				video_id: this.state.videoID,
			})
		})
		.then((response) => response.json())
		.then((res) => {

			if(res.payload) {
				/*this.state is an array of objects
				[
					{
						'comment': 'fsdfadsf',
						'created_at': '2020-03-14T19:18:15.741Z',
						'id': 23,
						'modified_at': '2020-03-14T19:18:15.741Z',
						'reply_id': null,
						'user_id': 1,
						'video_id': 894,
						username: 'izanami'
					},
					{}
				]
				*/
				this.setState({'comments' : res.payload});
			}
		})
		.catch((err) => {
			console.log("Error getting comments:", err);
		});
	}
	
	submitComment = () => {
		fetch('http://10.0.2.2:3000/saveComment', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				comment: this.state.comment,
				username: this.state.user_username,
				video_id: this.state.videoID,
				user_id: this.state.user_id,
				reply_id: null
			})
		})
		.then((response) => response.json())
		.then((res) => {
			if(res.success) {
				this.state.comments.push(res.success)
				this.setState({
					comments: this.state.comments
				})
				this.textInput.clear();
			}
		})
		.done();
	}

	startComment = (text) => {
		this.setState({comment : text})
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.title}>
					<Text>Comments</Text>
				</View>
				<View>
					<View style={styles.commentContainer}>
						<FlatList
							data={this.state.comments}
							keyExtractor = {item => item.id}
							style={styles.commentCard}
							renderItem={({item, index}) =>
								<View style={styles.commentBox}>
									<View style={styles.userInfoBox}>
										<Text style={styles.userInfo} >{item.username} </Text>
									</View>
									<Text style={styles.comment} >{item.comment}</Text>
								</View>
							}
						/>
						<View style={styles.formArea}>
							<TextInput style={styles.textInput} placeholder={this.state.commentPlaceHolder}
								ref={input => { this.textInput = input }}
								onChangeText={ (text)=> this.startComment(text)}
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
				</View>

			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {

	},
	title: {
		alignItems: 'center',
	},
	commentContainer: {
		alignItems: 'center',
		justifyContent: 'center',		
	},
	formArea : {
		width: 200,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		color: '#808080',
		padding: 16,
		marginBottom: 20,
		backgroundColor: '#fff'
	},
    btn: {
		padding: 20,
		backgroundColor: '#01c853',
		alignItems: 'center'
	},
	commentCard : {
		backgroundColor: '#808080',
		height: 150
	},
	commentBox: {
		flexDirection: 'row',
	},
	userInfoBox: {
		backgroundColor: '#808080',
		display: 'flex',
		flexBasis: 'auto'
	},
	userInfo : {
		color: 'black',
		fontWeight: 'bold',
		display: 'flex',
		flexBasis: 'auto'
	},
	comment: {
		color:'#000000',
		display: 'flex',
		flexBasis: 'auto'
	}
});