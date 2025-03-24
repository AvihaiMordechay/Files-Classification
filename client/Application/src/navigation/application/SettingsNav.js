import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '../../screens/settings/SettingsScreen';
import UserSettingsScreen from '../../screens/settings/UserSettings';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsMain"
                options={{ headerShown: false }}
                component={SettingsScreen}  // הסר את העברת ה-user כ-prop
            />

            <Stack.Screen
                name="UserSettings"
                component={UserSettingsScreen}
                options={{
                    title: 'הגדרות משתמש',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        writingDirection: 'rtl',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
