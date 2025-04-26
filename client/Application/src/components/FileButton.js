import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';

const FileButton = ({ file, onPress, folderName, presentFolderName = false }) => {
    const { markAsFavorite } = useUser();
    const [isFavorite, setIsFavorite] = useState(file.isFavorite === 1);

    // Sync state when props change
    useEffect(() => {
        setIsFavorite(file.isFavorite === 1);
    }, [file.isFavorite]);

    const handleFavorite = async (event) => {
        event.stopPropagation();
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        await markAsFavorite(newFavoriteState, file.id, folderName);
    };

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <TouchableOpacity onPress={handleFavorite} style={styles.starIcon}>
                <Ionicons
                    name={isFavorite ? 'star' : 'star-outline'}
                    size={constats.sizes.icon.star}
                    color={constats.colors.starIcon}
                />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <Ionicons name="document-outline" size={constats.sizes.icon.fileButton} color={constats.colors.primary} />
            </View>
            <Text style={styles.buttonText}>{file.name}</Text>

            {presentFolderName && (
                <Text style={styles.folderNameText}>{folderName}</Text>
            )}
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
        position: 'relative',
    },
    starIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 5, // מקל על הלחיצה על הכוכב
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
    folderNameText: {
        fontSize: constats.sizes.font.small,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },

});

export default FileButton;
