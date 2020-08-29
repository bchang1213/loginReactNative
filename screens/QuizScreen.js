import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	AsyncStorage,
	View,
} from 'react-native';
import { connect } from 'react-redux';

class QuizScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        };

        this.backToVideo = this.backToVideo.bind(this);
	}

	componentDidMount () {
	}

    backToVideo () {
        this.props.navigation.navigate('Video');
    }

	render() {
		return (
			<View style={styles.container} >
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.backToVideo}
                >
                    <Text>hello</Text>
                </TouchableOpacity>
			</View>
		);
	}
}

const mapState = (state) => ({
    user: state.user,
    video: state.focusPage
});

QuizScreen.navigationOptions = {
	header: null,
};

export default connect(mapState) (QuizScreen);

const styles = StyleSheet.create({
    wrapper : {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2896d3",
        paddingLeft: 40,
        paddingRight: 40
    },
    header : {
        fontSize: 24,
        marginBottom: 60,
        color: "#fff",
        fontWeight: "bold",
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