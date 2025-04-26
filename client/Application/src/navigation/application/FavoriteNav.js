import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FavoriteScreen from '../../screens/FavoriteScreen';
import FileScreen from '../../screens/FileScreen';

const Stack = createStackNavigator();

const FavoriteStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Favorite"
                component={FavoriteScreen}
                options={{ headerShown: false }}
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

export default FavoriteStackNavigator;