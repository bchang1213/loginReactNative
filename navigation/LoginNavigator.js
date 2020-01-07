import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const LoginStack = createStackNavigator(
  {
    Login: LoginScreen,
  },
  config
);


LoginStack.navigationOptions = {
  tabBarLabel: 'Sign On',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const RegisterStack = createStackNavigator(
  {
    Register: RegisterScreen,
  },
  config
);

RegisterStack.navigationOptions = {
  tabBarLabel: 'Register',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

RegisterStack.path = '';

LoginStack.path = '';

const tabNavigator = createBottomTabNavigator({
  LoginStack,
  RegisterStack,
});

tabNavigator.path = '';

export default tabNavigator;
