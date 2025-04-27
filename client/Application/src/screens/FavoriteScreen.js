import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';

const FavoriteScreen = ({ navigation }) => {
    const { user } = useUser();


    return (
        <>
            <View>
                <Header />
            </View>
        </>
    );
};

export default FavoriteScreen;