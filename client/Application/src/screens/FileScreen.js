import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import constats from '../styles/constats';

const FileScreen = ({ route }) => {
    const { file } = route.params || {};

    if (!file) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No file provided</Text>
            </View>
        );
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
