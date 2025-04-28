import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FileButton from '../components/FileButton';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
        <>
            <View>
                <Header />
            </View>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.baseText}>המועדפים שלי:</Text>
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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    baseText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginRight: 20,
        marginTop: 30,
        writingDirection: 'rtl',
        textAlign: 'right',
    },
    categoriesContainer: {
        marginTop: 20,
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

export default FavoriteScreen;