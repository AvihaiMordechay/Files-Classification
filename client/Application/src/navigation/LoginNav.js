import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ApplicationNavigator from './application/ApplicationNav';

const AuthStack = createStackNavigator();

const LoginNavigator = ({ user }) => {

    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} initialParams={{ user }} />
            <AuthStack.Screen name="Application" component={ApplicationNavigator} initialParams={{ user }} />
        </AuthStack.Navigator>
    );
};

export default LoginNavigator;