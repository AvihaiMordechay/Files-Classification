import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';

const FavoriteScreen = ({ navigation }) => {
    const { user } = useUser();
    const [file, setFile] = useState(user.folders["תחבורה"].files[0]); // delete

    const handleFilePress = () => { // add file as argument 
        navigation.navigate('File', {
            file: file
        });
    };

    return (
        <>
            <View>
                <Header />
                <Button title="NAV" onPress={handleFilePress} />   {/* delete */}
            </View>
        </>
    );
};

export default FavoriteScreen;