import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FileButton from '../components/FileButton';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useConstats } from '../styles/constats';

const FavoriteScreen = ({ navigation }) => {
    const constats = useConstats();
    const { user } = useUser();
    const favorites = user?.favorites || [];

    const getFileData = (fileId, folderName) => {
        return user?.folders?.[folderName]?.files?.[fileId] || null;
    };

    const validFavorites = favorites.filter(fav => {
        const file = getFileData(fav.fileId, fav.folderName);
        return file !== null;
    });

    const handleFilePress = (file, folderName) => {
        navigation.navigate('File', {
            file: file,
            folderName: folderName,
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 15,
        },
        baseText: {
            fontWeight: 'bold',
            fontSize: constats.sizes.font.large,
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
            fontSize: constats.sizes.font.medium,
            color: '#555',
        },
    });

    return (
        <>
            <View>
                <Header />
            </View>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.baseText}>מועדפים:</Text>
                    <ScrollView contentContainerStyle={styles.categoriesContainer}>
                        {validFavorites.length > 0 ? (
                            validFavorites.map((fav, index) => {
                                const file = getFileData(fav.fileId, fav.folderName);
                                if (!file) return null;
                                return (
                                    <FileButton
                                        key={`${fav.folderName}-${fav.fileId}-${index}`}
                                        file={file}
                                        onPress={() => handleFilePress(file, fav.folderName)}
                                        folderName={fav.folderName}
                                        presentFolderName={true}
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

export default FavoriteScreen;