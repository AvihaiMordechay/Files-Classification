import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import ApplicationNavigator from './application/ApplicationNav';

const AuthStack = createStackNavigator();

const RegistrationNavigator = ({ user }) => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            {/* <AuthStack.Screen name="Onboarding" component={OnboardingScreen} /> */}
            <AuthStack.Screen name="Registration" component={RegistrationScreen} initialParams={{ user }} />
            <AuthStack.Screen name="Application" component={ApplicationNavigator} initialParams={{ user }} />
        </AuthStack.Navigator>
    );
};

export default RegistrationNavigator;