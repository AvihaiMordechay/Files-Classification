import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';

const FileButton = ({ file, onPress, initialFavorite = false }) => {
    const { markAsFavorite } = useUser();
    const [isFavorite, setIsFavorite] = useState(initialFavorite);


    const handleFavortite = async (event) => {
        event.stopPropagation();
        await markAsFavorite();
        setIsFavorite((prev) => !prev);

    };

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <TouchableOpacity onPress={handleFavortite} style={styles.starIcon}>
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
    }
});

export default FileButton;
