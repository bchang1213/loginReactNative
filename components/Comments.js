import React from 'react';
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
	Text,
    View,
	Image,
} from 'react-native';
import { connect } from 'react-redux';
import reducer from '../store/users';

class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			comment: '',
			commentPlaceHolder: "Leave a comment"
		};
		this.getComments = this.getComments.bind(this);
		this.submitComment = this.submitComment.bind(this);
	}
	//Called Once on client
	componentDidMount () {
		console.log("Comment User: ", JSON.stringify(this.props.user))
		this.getComments();
	}

	getComments = () => {
		fetch('http://10.0.2.2:3000/getAllCommentsForVideoID', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				video_id: this.props.video.id,
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
				username: this.props.user.username,
				video_id: this.props.video.id,
				user_id: this.props.user.id,
				reply_id: null
			})
		})
		.then((response) => response.json())
		.then((res) => {
			if(res.success) {
				console.log("comments got: ", res.success)
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
				</View>
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
							<Image
								source={{ uri: 'https://reactjs.org/logo-og.png' }}
								style={styles.send}
							/>
						</TouchableOpacity>
					</View>
			</SafeAreaView>
		);
	}
}
const mapState = (state) => ({
	user: state.user,
	video: state.focusPage
});

export default connect(mapState) (Comments);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		justifyContent: 'space-between',
		flex: 0.8,
		flexDirection: 'column',
		backgroundColor: 'red'
	},
	title: {
		alignItems: 'center',
	},
	commentContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	formArea : {
		width: '100%',
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	textInput: {
		color: '#808080',
		backgroundColor: '#fff',
		width: '90%',
		height: '100%',
	},
    btn: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	send: {
		height: '100%',
		width: '100%',
		backgroundColor: "blue",
	},
	commentCard : {
		backgroundColor: '#808080',
		width: '100%',
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