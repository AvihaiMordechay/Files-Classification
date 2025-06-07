import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useConstats } from '../../styles/constats';

import HomeStackNavigator from './HomeNav';
import FavoriteStackNavigator from './FavoriteNav';
import SettingsNavigator from './SettingsNav';
import ActionMenu from '../../components/ActionMenu';

const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {
    const constats = useConstats();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#fff', height: 75 },
                tabBarActiveTintColor: constats.colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = focused ? 'star' : 'star-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                }
            })}
        >
            <Tab.Screen
                name="HomeTab"
                options={{ title: 'דף הבית' }}
            >
                {() => <HomeStackNavigator />}
            </Tab.Screen>
            <Tab.Screen
                name="Favorites"
                options={{ title: 'מועדפים' }}
            >
                {() => <FavoriteStackNavigator />}
            </Tab.Screen>

            <Tab.Screen
                name="Settings"
                options={{ title: 'הגדרות' }}
            >
                {() => <SettingsNavigator />}
            </Tab.Screen>
            <Tab.Screen
                name="Add"
                component={View}
                options={{
                    title: 'הוספה',
                    tabBarButton: () => (
                        <ActionMenu />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default ApplicationNavigator;