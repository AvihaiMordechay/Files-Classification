import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../../screens/HomeScreen';
import FolderScreen from '../../screens/FolderScreen';
import FileScreen from '../../screens/FileScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
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

export default HomeStackNavigator;