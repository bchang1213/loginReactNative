import React from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
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
			videoTitle: '',
			comments: null
		};
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
		console.log('this.state.videoID', this.state.videoID)
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
				console.log('got res payload: ', this.state.comments);
			}

			else {
				alert('getVideos' + res.error);
			}
		})
		.done();
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
			if(res.success) {
				console.log('success:', res.sucess)
				this.getComments();
			}

			else {
				console.log('res.error', res)
				alert(res);
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
				{ this.state.comments ?
                <FlatList
				data={this.state.comments}
				style={styles.commentsList}
                keyExtractor={item => item.id}
                renderItem={({item}) =>
                    <View style={styles.commentCard}>
                        <Text
                        style={styles.comment}
                        >{item.comment}</Text>
                    </View>
                }
                />
            	: null }
				<View style={styles.commentInputArea}>
					<TextInput style={styles.textInput} placeholder='Leave a comment.'
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
		display: 'grid',
		flexDirection: 'column',
		flexWrap: 'wrap',
		backgroundColor: '#2896d3',
		paddingLeft: 40,
		paddingRight: 40
    },
	textInput: {
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
	},
	commentsList : {
		marginBottom: 10
	},
	commentInputArea : {
	}
});