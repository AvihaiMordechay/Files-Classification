import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';

const FileScreen = ({ route }) => {
    const { file } = route.params || {};
    const { updateLastViewedToFile } = useUser();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        });

        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: { backgroundColor: '#fff', height: 75 },
            });
        };
    }, [navigation]);

    useEffect(() => {
        if (file) {
            updateLastViewedToFile(file.id);
        }
    }, [file]);

    if (!file) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No file provided</Text>
            </View>
        );
    }

    const handleShare = () => {
        console.log('שתף', file.path);
    };

    const handleCrop = () => {
        console.log('חתוך', file.path);
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: file.path }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.iconButton} onPress={handleCrop}>
                    <Ionicons name="crop" size={28} color="#333" />
                    <Text style={styles.iconLabel}>חתוך</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                    <Ionicons name="share-social-outline" size={28} color="#333" />
                    <Text style={styles.iconLabel}>שתף</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    image: {
        flex: 1,
        width: '100%',
    },
    errorText: {
        fontSize: constats.sizes.font.medium,
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    iconButton: {
        alignItems: 'center',
    },
    iconLabel: {
        marginTop: 4,
        fontSize: 12,
        color: '#333',
    },
});

export default FileScreen;
