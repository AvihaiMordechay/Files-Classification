import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ApplicationNavigator from './application/ApplicationNav';

const Stack = createStackNavigator();

const AuthenticatedNavigator = ({ user }) => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Application"
                component={ApplicationNavigator}
                initialParams={{ user }}
            />
        </Stack.Navigator>
    );
};

export default AuthenticatedNavigator;