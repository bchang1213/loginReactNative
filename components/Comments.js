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
								<Image
									source={{uri: 'https://image.flaticon.com/icons/svg/1933/1933005.svg'}}
									style={styles.send}
								/>
							</TouchableOpacity>
						</View>
					</View>
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
		justifyContent: 'center',
		flex: 120,
		flexDirection: 'column',
	},
	title: {
		alignItems: 'center',
	},
	commentContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	formArea : {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
		flexDirection: 'row',
	},
	textInput: {
		color: '#808080',
		padding: 16,
		marginBottom: 20,
		backgroundColor: '#fff',
		width: '100%'
	},
    btn: {
		padding: 10,
		backgroundColor: '#01c853',
		position: 'absolute',
		width: 10,
		height: 10
	},
	send: {
		height: 10,
		width: 10
	},
	commentCard : {
		backgroundColor: '#808080',
		height: 150,
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