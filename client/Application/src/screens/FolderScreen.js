import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import FileButton from '../components/FileButton';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

const FolderScreen = ({ route, navigation }) => {
    const { folderName } = route.params || {};
    const { user } = useUser();
    const files = user?.folders?.[folderName]?.files || {};

    const handleFilePress = (file) => {
        navigation.navigate('File', {
            file: file
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.categoriesContainer}>
                    {files && Object.keys(files).map((fileId) => {
                        const file = files[fileId];
                        return (
                            <FileButton
                                key={fileId}
                                file={file}
                                onPress={() => handleFilePress(file)}
                                folderName={folderName}
                            />
                        );
                    })}
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
    categoriesContainer: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default FolderScreen;