import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddFiles from '../components/AddFilesComponent';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: { backgroundColor: '#fff', height: 70 },
                    tabBarActiveTintColor: '#00C7BE',
                    tabBarInactiveTintColor: 'gray',
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
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
                <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'דף הבית' }} />
                <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'מועדפים' }} />
                <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'הגדרות' }} />
                <Tab.Screen name="Add" component={AddFiles} options={{ title: 'הוספה' }} />
                {/* <Tab.Screen
                    name="Add"
                    component={AddOptionsScreen}
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
                /> */}
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
        marginBottom: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});

export default TabNavigator;
