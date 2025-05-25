import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import ActionSheet from 'react-native-actions-sheet';
import ChangeFolderNameModal from './modals/ChangeFolderNameModal';
import AlertModal from './modals/AlertModal';
import { useUser } from '../context/UserContext';

const FolderButton = ({ folder, onPress, setResultSearch = null }) => {
    const { deleteFolder } = useUser();
    const [changeFolderNameModalVisible, setChangeFolderNameModalVisible] = useState(false);
    const [deleteFolderModalVisible, setDeleteFolderModalVisible] = useState(false);
    const actionSheetRef = useRef(null);

    const handleLongPress = () => {
        actionSheetRef.current?.show();
    };

    const handleActionSelect = (selectedIndex) => {
        switch (selectedIndex) {
            case 0:
                setChangeFolderNameModalVisible(true);
                break;
            case 1:
                setDeleteFolderModalVisible(true);
                break;
            default:
                break;
        }
    };

    const hangleDeleteFile = async () => {
        await deleteFolder(folder.name);
        if (setResultSearch) {
            setResultSearch(prev => prev.filter(item => item.name !== folder.name));
        }
        setDeleteFolderModalVisible(false);
    }

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
                onLongPress={handleLongPress}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="folder-outline" size={constats.sizes.icon.folderButton} color={constats.colors.primary} />
                </View>
                <Text style={styles.buttonText}>{folder.name}</Text>
                <Text style={styles.subButtonText}>{folder.filesCount} קבצים</Text>
            </TouchableOpacity>

            <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
                <View style={styles.actionSheetContainer}>
                    <Text style={styles.actionSheetTitle}>
                        בחר פעולה עבור תיקיית "{folder.name}"
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

            <ChangeFolderNameModal
                visible={changeFolderNameModalVisible}
                onClose={() => setChangeFolderNameModalVisible(false)}
                folderName={folder.name}
            />

            <AlertModal
                visible={deleteFolderModalVisible}
                onClose={() => setDeleteFolderModalVisible(false)}
                title={'אזהרה'}
                message={`האם ברצונך למחוק את התיקייה: ${folder.name}`}
                buttons={
                    [
                        { text: 'בטל', onPress: () => setDeleteFolderModalVisible(false) },
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
        writingDirection: 'center',
    },
    iconContainer: {
        marginBottom: 10,
    },
    buttonText: {
        fontSize: constats.sizes.font.medium,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    subButtonText: {
        fontSize: constats.sizes.font.small,
        color: '#888',
        textAlign: 'center',
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

export default FolderButton;
