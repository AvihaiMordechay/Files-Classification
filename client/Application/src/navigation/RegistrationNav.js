import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ApplicationNavigator from './application/ApplicationNav';

const AuthStack = createStackNavigator();

const RegistrationNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AuthStack.Screen name="Application" component={ApplicationNavigator} />
        </AuthStack.Navigator>
    );
};

export default RegistrationNavigator;