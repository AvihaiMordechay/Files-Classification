import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useUser } from '../../context/UserContext';
import theme from '../../styles/theme';

const CategoryListModel = ({ visible, onClose, attachedFile }) => {
    const { user, addNewFile } = useUser();

    const handleFolderSelect = async (folderName) => {
        const folder = user.folders[folderName];
        if (!folder) {
            Alert.alert('שגיאה', 'התיקייה לא קיימת');
            return;
        }

        const { id: folderId } = folder;
        const { name, mimeType, uri } = attachedFile;

        await addNewFile(name, folderId, mimeType, uri);
        onClose();

    };

    const folderNames = Object.keys(user?.folders || {});

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.title}>בחר תיקייה לשמירת הקובץ</Text>

                        <ScrollView style={styles.folderList}>
                            {folderNames.map((folderName, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.folderItem}
                                    onPress={() => handleFolderSelect(folderName)}
                                >
                                    <Text style={styles.folderText}>{folderName}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>ביטול</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    modalView: {
        ...theme.modal.modalView,
        width: '85%',
        maxHeight: '80%',
        padding: 20,
    },
    title: {
        ...theme.modal.modalTitle,
        marginBottom: 20,
    },
    folderList: {
        marginBottom: 20,
    },
    folderItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
    },
    folderText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'right',
    },
    cancelButton: {
        ...theme.modal.modalCancelButton,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    cancelButtonText: theme.modal.modalCancelButtonText,
});

export default CategoryListModel;
