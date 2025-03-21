import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';

const FileButton = ({ file, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="document-outline" size={constats.sizes.icon} color={constats.colors.primary} />
            </View>
            <Text style={styles.buttonText}>{file.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: constats.colors.backgroundButton,
        borderRadius: 12,
        margin: 6,
        width: constats.sizes.button.width,
        height: constats.sizes.button.height,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        writingDirection: 'center',
    },
    iconContainer: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: constats.sizes.font.medium,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    }
});

export default FileButton;
