import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  AsyncStorage,
  ScrollView,
  Image,
  View,
} from 'react-native';

export default class RegisterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordsMatch: false,
            formError: null,
        };
    }

    componentDidMount () {
        this._loadInitialState().done();
    }

    _loadInitialState = async () => {
        var value = await AsyncStorage.getItem('user');
        if (value !== null) {
            //This Controls switch navigator's state
            this.props.navigation.navigate('App');
        }
    }
    
    passwordCheck = (password) => {
	    var passwordreg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

    	if(!passwordreg.test(password) && this.state.formError === null){
    		this.setState({formError : "Password must be at least 8 chars and include 1 Capital letter, 1 numeral, 1 symbol."});
    	}

    	if(passwordreg.test(password)) {
    		this.setState({ formError : null });
    		this.setState({password});
    	}
    }

    register = () => {
        
        fetch('http://10.0.2.2:3000/addUser', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response) => response.json())
        .then((res) => {
            alert(res.success);
            if(res.success) {
                AsyncStorage.setItem('user', res.user);
                //This controls the switch navigator's state
                this.props.navigation.navigate('App');
            }

            else {
                alert(res.error);
            }
        })
        .done();
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.wrapper} behavior='padding'>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        Register
                    </Text>
                    {this.state.formError ? <Text>{this.state.formError}</Text> : null}

                    <TextInput style={styles.textInput} placeholder="Email"
                        onChangeText={ (email)=> this.setState({email})}
                        keyboardType= 'email-address'
                        underlineColorAndroid='transparent'
                    />

                    <TextInput style={styles.textInput} placeholder="Password"
                        onChangeText={ (password)=> this.passwordCheck(password) }
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                    />
                    <TextInput style={styles.textInput} placeholder="Confirm Password"
                        onChangeText={ (confirm_password)=> {
                        		if(this.state.password === confirm_password){
                        			this.setState({passwordsMatch : true});
                        		}
                        	}
                        }
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                    />

                    {/* Ternary Operator: If Confirm Passwords Match, then allow Form Submission */}
                    {this.state.passwordsMatch ?
                    	<TouchableOpacity
                        style={styles.btn}
                        onPress={this.register}
                    >
                    	<Text>Register</Text>
                    </TouchableOpacity> :
                    null
                	}
                </View>
            </KeyboardAvoidingView>
        );
    }
}

RegisterScreen.navigationOptions = {
  header: null,
};

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
