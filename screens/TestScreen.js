import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
    FlatList,
	AsyncStorage,
    View,
    Image
} from 'react-native';
import { Video } from 'expo-av';

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
        
        this.goToVideo = this.goToVideo.bind(this);
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
    
	goToVideo = (video_uri, item) => {
        alert("got vid uri: " + item);
        AsyncStorage.setItem('focusedURI', video_uri);
        AsyncStorage.setItem('focusedVideo', JSON.stringify(item));
		this.props.navigation.navigate('Videos');
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
                keyExtractor={item => item.id}
                renderItem={({item}) =>
                    <View style={styles.videoCard}>
                        <Text
                        style={styles.videoTitle}
                        onPress={() => this.goToVideo(item.uri, item)}
                        >{item.name}</Text>
                        <Video
                        id={item.id.toString()}
                        source={{ uri : item.link }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        ref={this.handleVideoMount}
                        useNativeControls={true}
                        resizeMode="cover"
                        style={{ width: 300, height: 200 }}
                        />
                    </View>
                }
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
        marginTop: 10
    }
});