import React from 'react';
import {
	StyleSheet,
	Text,
    FlatList,
    Image,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { focusOnVideo } from '../store';
import { Video } from 'expo-av';

class TaggerScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            videos: null
        };
        
	}
	//Called Once on client
	componentDidMount () {
        if(this.state.videos === null) {
            this.getVideos();
        }
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
    //data is displayed to browser.
	componentWillUnmount() {
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
                this.setState({videos: res.success});
			}

			else {
				alert("getVideos" + res.error);
			}
		})
		.done();
    }
    
	goToVideo = (item) => {
        focusOnVideo(item, this.props.navigation);
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
                            onPress={() => this.goToVideo(item)}
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
/* Redux's this.props.user object is not explicitly used in this screen
because we are currently using AsyncStorage to do a "is the user signedin?" check.
later, when we implement Redux-Persist, this mapState function will be
crucial.*/
const mapState = (state) => ({
    user: state.user,
    focusPage: state.focusPage
});

TaggerScreen.navigationOptions = {
    header: null,
};

export default connect(mapState) (TaggerScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#3b3e40",
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
    },
    videoSection : {
        backgroundColor: '#FFFFFF',
        padding: 10,
        margin: 10
    }

});