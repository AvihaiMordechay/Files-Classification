import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

const FolderButton = ({ folder, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={theme.sizes.icon} color={theme.colors.primary} />
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
        backgroundColor: theme.colors.backgroundButton,
        borderRadius: 12,
        margin: 6,
        width: theme.sizes.button.width,
        height: theme.sizes.button.height,
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
        fontSize: theme.sizes.font.medium,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    subButtonText: {
        fontSize: theme.sizes.font.small,
        color: '#888',
        textAlign: 'center',
    },
});

export default FolderButton;
