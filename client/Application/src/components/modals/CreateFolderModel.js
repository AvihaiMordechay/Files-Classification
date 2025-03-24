import { Modal } from "react-native";
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from "../../styles/theme";


const CreateFolderModel = ({ visible, onClose }) => {
    const [newFolderName, setNewFolderName] = useState("");

    const handleNewFolder = () => {
        try {

        } catch (error) {

        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        style={styles.centeredView}
                    >
                        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                            <Text style={styles.modalTitle}>צור תיקייה חדשה</Text>

                            <View style={styles.modalInputContainer}>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="הכנס שם לתיקייה"
                                    placeholderTextColor="#999"
                                    keyboardType="name"
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
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>

        </Modal>

    );

}

export default CreateFolderModel;

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    centeredView: theme.modal.centeredView,
    modalView: theme.modal.modalView,
    modalTitle: theme.modal.modalTitle,
    modalInputContainer: theme.modal.modalInputContainer,
    modalInput: theme.modal.modalInput,
    modalButtonsContainer: theme.modal.modalButtonsContainer,
    modalCancelButton: theme.modal.modalCancelButton,
    modalCancelButtonText: theme.modal.modalCancelButtonText,
    modalSaveButton: theme.modal.modalSaveButton,
    modalSaveButtonText: theme.modal.modalSaveButtonText,
    disabledButton: theme.modal.disabledButton
});