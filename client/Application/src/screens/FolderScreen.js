import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FolderScreen = ({ route }) => {
    const { folderName, filesCount } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{folderName}</Text>
            <Text style={styles.subtitle}>{filesCount} קבצים</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default FolderScreen;
