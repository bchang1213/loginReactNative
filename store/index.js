import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import socket from './socket';
import users, { gotUsers, userOnline } from './users';
import messages, { gotMessages, gotNewMessage } from './messages';
import user, { gotUser } from './user';
import focusPage, { currentPage, focusedVideo } from './focusPage';

const reducers = combineReducers({ users, messages, user, focusPage });

// Middleware: Redux Persist Config
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'users',
        'messages',
        'user'
    ],
    blacklist: [
        'focusPage',
    ],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
    persistedReducer,
    // applyMiddleware(createLogger())
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

let navigate = null;

socket.on('priorMessages', messages => {
    store.dispatch(gotMessages(messages));
});

//User logins in and visualizes the full list of other users for chat.
socket.on('gotUser', response => {
    const { user, users } = response;
    store.dispatch(gotUser(JSON.parse(user)));
    store.dispatch(gotUsers(users));
    navigate('App');
});

//User becomes online. saves current user's id to redux state.
socket.on('userOnline', user => {
    store.dispatch(userOnline(user));
});

socket.on('incomingMessage', message => {
    store.dispatch(gotNewMessage(message));
});

export const login = (credentials, navigation) => {
    fetch('http://10.0.2.2:3000/signinUser', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
        })
    })
    .then((response) => response.json())
    .then((res) => {
        if(res.success) {
            /*Emitting to this socket will get all users and then save the current user into redux.*/
            socket.emit('getAllUsers', JSON.stringify(res.success));
            //This controls the switch navigator's state
            navigate = navigation.navigate;
        }

        else {
            alert("The provided login information was not valid:", err)
        }
    })
    .done();
};

export const openChat = (user, receiver) => {
    var users = {
        user: user,
        receiver: receiver
    };
    socket.emit('chat', users);
};

export const focusOnVideo = (videoObject, navigation) => {
    store.dispatch(focusedVideo(videoObject));
    navigation.navigate('Videos');
};

export const sendMessage = (text, sender, receiver) => {
    socket.emit('message', { text, sender, receiver });
};


export {
    store,
    persistor,
};

export * from './users';
export * from './messages';
export * from './focusPage';