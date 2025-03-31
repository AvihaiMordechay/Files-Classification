import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';

const FolderButton = ({ folder, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={constats.sizes.icon.folderButton} color={constats.colors.primary} />
            </View>
            <Text style={styles.buttonText}>{folder.name}</Text>
            <Text style={styles.subButtonText}>{folder.filesCount} קבצים</Text>
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
        writingDirection: 'center', // This ensures the text is rendered right-to-left
    },
    iconContainer: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: constats.sizes.font.medium,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    subButtonText: {
        fontSize: constats.sizes.font.small,
        color: '#888',
        textAlign: 'center',
    },
});

export default FolderButton;
