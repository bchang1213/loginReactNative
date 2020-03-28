import React from 'react';
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	AsyncStorage,
	Text,
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
						'video_id': 894
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
				video_id: this.state.videoID,
				user_id: this.state.user_id,
				reply_id: null
			})
		})
		.then((response) => response.json())
		.then((res) => {
			console.log("got response from submitcomment")
			if(res.success) {
				console.log("got success", JSON.stringify(res.success));
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

	formatReadableDate = (date, detail, zoneOffset) => {
	    if (typeof detail === 'undefined') {
			detail = false;
		}
	
		if (typeof zoneOffset === 'undefined') {
			zoneOffset = 0;
		}
	
		zoneOffset = parseInt(zoneOffset) || 0;
	
		try {
	
			if (zoneOffset) {
				date = new Date(date.getTime() + zoneOffset * 60 * 60 * 1000);
			}
	
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
	
			var formatted = (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day) + '/' + year;
	
			if (detail) {
	
				var hours = date.getHours(),
					minutes = date.getMinutes(),
					mid = 'PM';
	
				if (hours < 12) {
					mid = 'AM';
				}
	
				hours = hours % 12;
				hours = hours ? hours : 12;
	
				if (hours < 10) {
					hours = '0' + hours;
				}
	
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
	
				formatted += ' at ' + hours + ':' + minutes + ' ' + mid;
				formatted
			}
	
			return formatted;
		} catch (e) {
			return "";
		}
	}

	render() {
		return (
			<View style="container">
				<View>
					<Text>Comments</Text>
				</View>
				<View>
					{ this.state.comments ?
						this.state.comments.map((comment) =>
						<View style={styles.commentCard}>
							<View style={styles.userInfoBox}>
								<Text style={styles.userInfo} >{this.state.user_username} </Text>
								<Text style={styles.commentDate} >{comment.created_at}</Text>
							</View>
							<Text
							style={styles.comment}
							>{comment.comment}</Text>
						</View>
					)
					:
					<Text>No comments.</Text>}
				</View>
				<View style="formArea">
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
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		flexBasis: 'auto',
		backgroundColor: '#2896d3',
		paddingLeft: 40,
		paddingRight: 40,
		borderColor: "red",
		borderStyle: "solid",
		borderWidth: 2,
		alignItems: 'center'

	},
	userInfoBox: {
		backgroundColor: '#808080'
	},
	userInfo : {
		color: 'black',
		fontWeight: 'bold'
	}
	,
	textInput: {
		color: '#808080',
		alignSelf: 'stretch',
		padding: 16,
		marginBottom: 20,
		backgroundColor: '#fff'
	},
    btn: {
		alignSelf: 'stretch',
		padding: 20,
		backgroundColor: '#01c853',
		alignItems: 'center'
	},
	comment: {
		color:'#000000'
	},
	commentCard : {
		backgroundColor: '#808080',
		display: 'flex',
		flexDirection:'row',
		flexWrap:'wrap'
	},
	commentsList : {
		backgroundColor: "red",
		height: 150,
		display: 'flex',
		flexBasis: 'auto'
	},
	formArea : {
		backgroundColor: 'black'
	}
});