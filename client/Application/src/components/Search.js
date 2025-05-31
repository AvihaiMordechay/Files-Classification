import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { View, TextInput, StyleSheet } from 'react-native';
import { useConstats } from "../styles/constats";
import { Ionicons } from '@expo/vector-icons';

const Search = ({ setResultSearch }) => {
    const constats = useConstats();

    const { user } = useUser();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (searchValue.trim().length >= 2) {
            performSearch(searchValue);
        }
    }, [user.favorites]);

    const performSearch = (text) => {
        const searchLower = text.toLowerCase();

        if (searchLower.trim().length < 2) {
            setResultSearch([]);
            return;
        }

        const foldersResults = Object.entries(user.folders || {})
            .filter(([name, folder]) => name.toLowerCase().includes(searchLower))
            .map(([name, folder]) => ({
                id: folder.id,
                name,
                files: folder.files,
                filesCount: folder.filesCount,
                type: 'folder',
            }));

        const filesResults = Object.entries(user.folders || {})
            .flatMap(([folderName, folder]) =>
                Object.entries(folder.files || {}).map(([fileId, file]) => {
                    return {
                        id: fileId,
                        name: file.name,
                        path: file.path,
                        fileType: file.type,
                        isFavorite: file.isFavorite,
                        lastViewed: file.lastViewed,
                        folderName: folderName,
                        type: 'file',
                    };
                })
            )
            .filter(file => file.name.toLowerCase().includes(searchLower));

        const combinedResults = [...foldersResults, ...filesResults];

        if (combinedResults.length === 0) {
            setResultSearch(-1);
        } else {
            setResultSearch(combinedResults);
        }
    };

    const handleSearch = (text) => {
        setSearchValue(text);
        performSearch(text);
    };

    const styles = StyleSheet.create({
        searchContainer: {
            alignItems: 'center',
            marginVertical: 15,
        },
        searchBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: constats.colors.white,
            borderRadius: 12,
            paddingHorizontal: 15,
            height: 55,
            width: '90%',
            borderWidth: 1,
            borderColor: '#E0E0E0',
        },
        searchIcon: {
            marginLeft: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: constats.sizes.font.medium + 2,
            textAlign: 'right',
            color: '#333',
            fontWeight: '500',
        },
    });

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={constats.sizes.icon.default} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="חפש שם תיקייה או קובץ"
                    placeholderTextColor="#999"
                    value={searchValue}
                    onChangeText={(text) => handleSearch(text)}
                />
            </View>
        </View>
    );
};

export default Search;
