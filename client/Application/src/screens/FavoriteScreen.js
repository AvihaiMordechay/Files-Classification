import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FileButton from '../components/FileButton';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import constats from '../styles/constats';

const FavoriteScreen = ({ navigation }) => {
    const { user } = useUser();
    const favorites = user?.favorites || [];

    const getFileData = (fileId, folderName) => {
        return user?.folders?.[folderName]?.files?.[fileId] || null;
    };

    const validFavorites = favorites.filter(fav => {
        const file = getFileData(fav.fileId, fav.folderName);
        return file !== null;
    });

    const handleFilePress = (file) => {
        navigation.navigate('File', {
            file: file
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header />
                <Text style={styles.title}>מועדפים</Text>
                <ScrollView contentContainerStyle={styles.categoriesContainer}>
                    {validFavorites.length > 0 ? (
                        validFavorites.map((fav, index) => {
                            const file = getFileData(fav.fileId, fav.folderName);
                            if (!file) return null;
                            return (
                                <FileButton
                                    key={`${fav.folderName}-${fav.fileId}-${index}`}
                                    file={file}
                                    onPress={() => handleFilePress(file)}
                                    folderName={fav.folderName}
                                />
                            );
                        })
                    ) : (
                        <View style={styles.noFavoritesContainer}>
                            <Text style={styles.noFavoritesText}>אין מועדפים להציג</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: constats.sizes.font.large,
        fontWeight: 'bold',
        textAlign: 'right',
        marginVertical: 20,
        color: '#333',
        paddingHorizontal: 25,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFavoritesContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    noFavoritesText: {
        fontSize: 16,
        color: '#555',
    },
});

export default FavoriteScreen;
