import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FolderScreen from '../screens/FolderScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FileScreen from '../screens/FileScreen';
import AddFiles from '../components/AddFilesComponent';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator שמנהל את HomeScreen ואת FolderScreen
const HomeStackNavigator = ({ user }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ user }}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Folder"
                component={FolderScreen}
                options={({ route }) => ({
                    title: route.params?.folderName || 'תקייה',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        writingDirection: 'rtl',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                    },
                })}
            />
            <Stack.Screen
                name="File"
                component={FileScreen}
                options={({ route }) => ({
                    title: route.params?.file.name || 'קובץ',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        writingDirection: 'rtl',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                    },
                })}
            />
        </Stack.Navigator>
    );
};

const TabNavigator = ({ user }) => {
    return (
        <NavigationContainer>
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
        </NavigationContainer>
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

export default TabNavigator;
