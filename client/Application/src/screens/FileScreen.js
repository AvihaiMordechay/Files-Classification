import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';

const FileScreen = ({ route }) => {
    const { file } = route.params || {};
    const { updateLastViewedToFile } = useUser();

    if (!file) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No file provided</Text>
            </View>
        );
    } else {
        updateLastViewedToFile(file.id);
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: file.path }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    errorText: {
        fontSize: constats.sizes.font.medium,
        color: 'red',
    },
});

export default FileScreen;
