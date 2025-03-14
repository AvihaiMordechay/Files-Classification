import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FolderButton from '../components/FolderButton';
import { useUser } from '../context/UserContext';
import Spinner from '../components/Spinner';

const HomeScreen = ({ navigation }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    const handleFolderPress = (folder) => {
        navigation.navigate('Folder', {
            folderName: folder.name,
            files: folder.files
        });
    };

    if (isLoading) {
        return <Spinner text="טוען את הנתונים..." />;
    }

    return (
        <>
            <View>
                <Header />
            </View>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.baseText}>התיקיות שלי:</Text>
                    <ScrollView contentContainerStyle={styles.foldersContainer}>
                        {user.folders &&
                            Object.entries(user.folders).map(([name, folder]) => (
                                <FolderButton
                                    key={folder.id}
                                    folder={{ name, ...folder }}
                                    onPress={() => handleFolderPress({ name, ...folder })}
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
