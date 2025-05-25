import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';
import ActionSheet from 'react-native-actions-sheet';
import ChangeFileNameModal from './modals/ChangeFileNameModal';
import AlertModal from './modals/AlertModal';

const FileButton = ({ file, onPress, folderName, presentFolderName = false, setResultSearch = null }) => {
    const { markAsFavorite, user, deleteFile } = useUser();
    const [changeFileNameModalVisible, setChangeFileNameModalVisible] = useState(false);
    const [deleteFileModalVisible, setDeleteFileModalVisible] = useState(false);
    const actionSheetRef = useRef(null);

    const checkIsFavorite = () => {
        if (file.id) {
            return user?.favorites?.some(
                fav => fav.fileId === file.id && fav.folderName === folderName
            ) || file.isFavorite === 1;
        }
        return file.isFavorite === 1;
    };

    const [isFavorite, setIsFavorite] = useState(checkIsFavorite());

    useEffect(() => {
        setIsFavorite(checkIsFavorite());
    }, [user.favorites, file.isFavorite]);

    const handleFavorite = async (event) => {
        event.stopPropagation();
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        await markAsFavorite(newFavoriteState, file.id, folderName);
    };

    const handleLongPress = () => {
        actionSheetRef.current?.show();
    };

    const hangleDeleteFile = async () => {
        await deleteFile(folderName, file.id);
        if (setResultSearch) {
            setResultSearch(prev => prev.filter(item => item.id !== file.id));
        }
        setDeleteFileModalVisible(false);
    }

    const handleActionSelect = (selectedIndex) => {
        switch (selectedIndex) {
            case 0:
                setChangeFileNameModalVisible(true);
                break;
            case 1:
                setDeleteFileModalVisible(true);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.button,
                    { height: constats.sizes.button.height + (presentFolderName ? 15 : 0) }
                ]}
                onPress={onPress}
                onLongPress={handleLongPress}
            >
                <TouchableOpacity onPress={handleFavorite} style={styles.starIcon}>
                    <Ionicons
                        name={isFavorite ? 'star' : 'star-outline'}
                        size={constats.sizes.icon.star}
                        color={constats.colors.starIcon}
                    />
                </TouchableOpacity>
                <View style={styles.iconContainer}>
                    <Ionicons name="document-outline" size={constats.sizes.icon.fileButton} color={constats.colors.primary} />
                </View>
                <Text style={styles.buttonText}>{file.name}</Text>

                {presentFolderName && (
                    <Text style={styles.folderNameText}>{folderName}</Text>
                )}

                <Text style={styles.folderNameText}>{file.size}</Text>

            </TouchableOpacity>

            <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
                <View style={styles.actionSheetContainer}>
                    <Text style={styles.actionSheetTitle}>
                        בחר פעולה עבור "{file.name}"
                    </Text>
                    <Text style={styles.actionSheetMessage}>
                        בחר אחת מהאפשרויות הבאות
                    </Text>

                    <TouchableOpacity
                        style={styles.actionSheetButton}
                        onPress={() => {
                            actionSheetRef.current?.hide();
                            handleActionSelect(0);
                        }}
                    >
                        <Text style={styles.actionSheetButtonText}>שנה שם</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionSheetButton, styles.destructiveButton]}
                        onPress={() => {
                            actionSheetRef.current?.hide();
                            handleActionSelect(1);
                        }}
                    >
                        <Text style={[styles.actionSheetButtonText, styles.destructiveText]}>מחק</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionSheetButton, styles.cancelButton]}
                        onPress={() => actionSheetRef.current?.hide()}
                    >
                        <Text style={styles.actionSheetButtonText}>ביטול</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            <ChangeFileNameModal
                visible={changeFileNameModalVisible}
                onClose={() => setChangeFileNameModalVisible(false)}
                fileId={file.id}
                folderName={folderName}
            />

            <AlertModal
                visible={deleteFileModalVisible}
                onClose={() => setDeleteFileModalVisible(false)}
                title={'אזהרה'}
                message={`האם ברצונך למחוק את הקובץ: ${file.name}`}
                buttons={
                    [
                        { text: 'בטל', onPress: () => setDeleteFileModalVisible(false) },
                        { text: 'מחק', onPress: () => hangleDeleteFile() }

                    ]
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: constats.colors.backgroundButton,
        borderRadius: 12,
        margin: 6,
        width: constats.sizes.button.width,
        height: constats.sizes.button.height,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        position: 'relative',
    },

    starIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 5,
    },
    iconContainer: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: constats.sizes.font.medium + 2,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    folderNameText: {
        fontSize: constats.sizes.font.small + 1,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
    actionSheetContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    },
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    actionSheetMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    actionSheetButton: {
        paddingVertical: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    actionSheetButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: constats.colors.primary,
        textAlign: 'center',
    },
    destructiveButton: {
        backgroundColor: '#fff0f0',
    },
    destructiveText: {
        color: '#ff3b30',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginTop: 5,
    },
});

export default FileButton;