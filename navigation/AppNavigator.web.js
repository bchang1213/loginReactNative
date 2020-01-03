import { createBrowserApp } from '@react-navigation/web';

import { createSwitchNavigator } from 'react-navigation';
//Pre Login Navigator
import LoginNavigator from './LoginNavigator';
//Post Login Navigator
import MainTabNavigator from './MainTabNavigator';

const switchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: MainTabNavigator,
  Auth: LoginNavigator,
},
{
  initialRouteName: 'AuthLoading',
});

switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
