import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FolderButton = ({ category, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={40} color="#00C7BE" />
            </View>
            <Text style={styles.buttonText}>{category.tagName}</Text>
            <Text style={styles.subButtonText}>{category.filesCount} קבצים</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        margin: 6,
        width: 100, // Adjust the width to fit your grid
        height: 120, // Adjust the height to fit your grid
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        writingDirection: 'center', // This ensures the text is rendered right-to-left
    },
    iconContainer: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    subButtonText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
});

export default FolderButton;
