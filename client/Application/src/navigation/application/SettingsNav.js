import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '../../screens/settings/SettingsScreen';
import UserSettingsScreen from '../../screens/settings/UserSettings';
import { useConstats } from '../../styles/constats';
import AccessibilityScreen from '../../screens/AccessibilityScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
    const constats = useConstats();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsMain"
                options={{ headerShown: false }}
                component={SettingsScreen}
            />

            <Stack.Screen
                name="UserSettings"
                component={UserSettingsScreen}
                options={{
                    title: 'הגדרות משתמש',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        writingDirection: 'rtl',
                        fontSize: constats.sizes.font.medium + 2,
                        fontWeight: 'bold',
                        color: 'black',
                    },
                }}
            />

            <Stack.Screen
                name="Accessibility"
                component={AccessibilityScreen}
                options={{
                    title: 'נגישות',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        writingDirection: 'rtl',
                        fontSize: constats.sizes.font.medium + 2,
                        fontWeight: 'bold',
                        color: 'black',
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
