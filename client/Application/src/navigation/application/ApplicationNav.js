import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from './HomeNav';
import FavoritesScreen from '../../screens/FavoritesScreen';
import SettingsNavigator from './SettingsNav';
import AddFiles from '../../components/AddFiles';
import constats from '../../styles/constats';


const Tab = createBottomTabNavigator();

const ApplicationNavigator = () => {

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
                component={FavoritesScreen}
                options={{ title: 'מועדפים' }}
            />

            <Tab.Screen
                name="Settings"
                options={{ title: 'הגדרות' }}
            >
                {() => <SettingsNavigator />}
            </Tab.Screen>
            <Tab.Screen
                name="Add"
                component={AddFiles}
                options={{
                    title: 'הוספה',
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={styles.addButton}
                        >
                            <Ionicons name="add-circle" size={80} color={constats.colors.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    addButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,
        marginLeft: -10,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});

export default ApplicationNavigator;