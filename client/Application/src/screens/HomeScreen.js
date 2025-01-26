import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FolderButton from '../components/FolderButton';

const HomeScreen = ({ route, navigation }) => {
    const { user } = route.params || {};

    const handleCategoryPress = (category) => {
        navigation.navigate('Folder', {
            folderName: category.tagName,
            filesCount: category.filesCount,
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
                    <ScrollView contentContainerStyle={styles.categoriesContainer}>
                        {user.foldersCategories?.map((category, index) => (
                            <FolderButton
                                key={index}
                                category={category}
                                onPress={() => handleCategoryPress(category)}
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
    categoriesContainer: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
