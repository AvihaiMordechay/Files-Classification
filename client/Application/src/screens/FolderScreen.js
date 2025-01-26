import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import FileButton from '../components/FileButton';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const FolderScreen = ({ route, navigation }) => {
    const { files } = route.params || {};

    console.log(files);
    const handleFilePress = (file) => {
        navigation.navigate('File', {
            file: file
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.categoriesContainer}>
                    {files?.map((file, index) => (
                        <FileButton
                            key={index}
                            file={file}
                            onPress={() => handleFilePress(file)}
                        />
                    ))}
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
