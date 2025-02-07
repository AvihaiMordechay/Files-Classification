import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from './HomeNav';
import FavoritesScreen from '../../screens/FavoritesScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import AddFiles from '../../components/AddFilesComponent';


const Tab = createBottomTabNavigator();

const ApplicationNavigator = ({ route }) => {
    const { user } = route.params || {};

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#fff', height: 75 },
                tabBarActiveTintColor: '#00C7BE',
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
                {() => <HomeStackNavigator user={user} />}
            </Tab.Screen>
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                initialParams={{ user }}
                options={{ title: 'מועדפים' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                initialParams={{ user }}
                options={{ title: 'הגדרות' }}
            />
            <Tab.Screen
                name="Add"
                component={AddFiles}
                initialParams={{ user }}
                options={{
                    title: 'הוספה',
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={styles.addButton}
                        >
                            <Ionicons name="add-circle" size={80} color="#00C7BE" />
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