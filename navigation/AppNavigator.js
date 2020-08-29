import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// Post Login Navigator
import MainTabNavigator from './MainTabNavigator';
// Pre Login Navigator
import LoginNavigator from './LoginNavigator';
// Video Navigator
import VideoNavigator from './VideoNavigator';
//Loading Screen to Show After Authentication
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
//Conversation Screen to speak with another user
import ConversationScreen from '../screens/ConversationScreen';
//Quiz Screen
import QuizScreen from '../screens/QuizScreen';

//If Not logged in, show Login Navigator
//If logged in, then show maintab navigator
export default createAppContainer(
  createSwitchNavigator({
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Videos: VideoNavigator,
      Auth: LoginNavigator,
      Conversation: ConversationScreen,
      Quiz: QuizScreen
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
