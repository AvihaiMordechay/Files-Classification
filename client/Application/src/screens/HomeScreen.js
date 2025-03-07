import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FolderButton from '../components/FolderButton';

const HomeScreen = ({ route, navigation }) => {
    const { user } = route.params || {};

    const handleFolderPress = (folder) => {
        navigation.navigate('Folder', {
            folderName: folder.name,
            files: folder.files
        });
    };

    return (
        <>
            <View>
                <Header user={user} />
            </View>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.baseText}>התיקיות שלי:</Text>
                    <ScrollView contentContainerStyle={styles.foldersContainer}>
                        {user.folders?.map((folder, index) => (
                            <FolderButton
                                key={index}
                                folder={folder}
                                onPress={() => handleFolderPress(folder)}
                            />
                        ))}
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
    foldersContainer: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
