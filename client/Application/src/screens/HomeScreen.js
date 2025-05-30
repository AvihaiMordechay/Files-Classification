import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FolderButton from '../components/FolderButton';
import { useUser } from '../context/UserContext';
import Spinner from '../components/Spinner';
import Search from '../components/Search';
import FileButton from '../components/FileButton';

const HomeScreen = ({ navigation }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [resultSearch, setResultSearch] = useState([]);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    const handleItemPress = (item) => {
        if (item.type === 'folder') {
            navigation.navigate('Folder', {
                folderName: item.name,
            });
        } else if (item.type === 'file') {
            navigation.navigate('File', {
                file: item,
                folderName: item.folderName
            });
        }
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
                    <Search
                        setResultSearch={setResultSearch}
                    />
                    <ScrollView contentContainerStyle={styles.foldersContainer}>
                        {resultSearch === -1 ? (
                            <Text style={styles.noResultsText}>לא נמצאו תוצאות חיפוש</Text>
                        ) : resultSearch.length > 0 ? (
                            resultSearch.map((item) => {
                                if (item.type === 'folder') {
                                    return (
                                        <FolderButton
                                            key={`folder-${item.id}`}
                                            folder={item}
                                            onPress={() => handleItemPress(item)}
                                            setResultSearch={setResultSearch}
                                        />
                                    );
                                } else if (item.type === 'file') {
                                    return (
                                        <FileButton
                                            key={`file-${item.id}`}
                                            file={item}
                                            onPress={() => handleItemPress(item)}
                                            folderName={item.folderName}
                                            presentFolderName={true}
                                            setResultSearch={setResultSearch}
                                        />
                                    );
                                }
                            })
                        ) : (
                            user.folders &&
                            Object.entries(user.folders).map(([name, folder]) => (
                                <FolderButton
                                    key={folder.id}
                                    folder={{ name, ...folder }}
                                    onPress={() => {
                                        const item = { name: name, type: "folder" };
                                        handleItemPress(item);
                                    }}
                                />
                            ))
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
    foldersContainer: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
