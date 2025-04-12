import React, { useState } from 'react';
import { Modal, Alert, View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from "../../styles/theme";
import { useUser } from '../../context/UserContext';

const CreateFolderModal = ({ visible, onClose, attachedFile = null }) => {
    const { createNewFolder, addNewFile } = useUser();
    const [newFolderName, setNewFolderName] = useState("");

    const handleNewFolder = async () => {
        try {
            const folderId = await createNewFolder(newFolderName);
            if (attachedFile) {
                Alert.alert(
                    "צרף קובץ",
                    "האם לצרף את הקובץ לתיקייה החדשה?",
                    [
                        {
                            text: "לא",
                            style: "cancel"
                        },
                        {
                            text: "כן",
                            onPress: async () => {
                                await addNewFile(attachedFile.name, folderId, attachedFile.mimeType, attachedFile.uri);
                            }
                        }
                    ]
                );
            }
            setNewFolderName("");
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView style={styles.centeredView}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                <Text style={styles.modalTitle}>צור תיקייה חדשה</Text>

                                <Text style={styles.modalLabel}>שם התיקייה</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס שם לתיקייה"
                                        placeholderTextColor="#999"
                                        keyboardType="default"
                                        onChangeText={setNewFolderName}
                                        value={newFolderName}
                                    />
                                </View>

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                        <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalSaveButton, !newFolderName && styles.disabledButton]}
                                        onPress={handleNewFolder}
                                        disabled={!newFolderName}
                                    >
                                        <Text style={styles.modalSaveButtonText}>צור</Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CreateFolderModal;

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    centeredView: theme.modal.centeredView,
    scrollViewContent: theme.modal.scrollViewContent,
    modalView: theme.modal.modalView,
    modalTitle: theme.modal.modalTitle,
    modalLabel: theme.modal.modalLabel,
    modalInputContainer: theme.modal.modalInputContainer,
    modalInput: theme.modal.modalInput,
    modalButtonsContainer: theme.modal.modalButtonsContainer,
    modalSaveButton: theme.modal.modalSaveButton,
    modalSaveButtonText: theme.modal.modalSaveButtonText,
    modalCancelButton: theme.modal.modalCancelButton,
    modalCancelButtonText: theme.modal.modalCancelButtonText,
    disabledButton: theme.modal.disabledButton
});
