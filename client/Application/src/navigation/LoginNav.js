import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import ApplicationNavigator from './application/ApplicationNav';
import RegistrationNavigator from './RegistrationNav';

const AuthStack = createStackNavigator();

const LoginNavigator = () => {

    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Application" component={ApplicationNavigator} />
        </AuthStack.Navigator>
    );
};

export default LoginNavigator;