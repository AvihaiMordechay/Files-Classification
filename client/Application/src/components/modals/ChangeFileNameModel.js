import React, { useState } from 'react';
import { Modal, Alert, View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from "../../styles/theme";
import constats from '../../styles/constats';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const ChangeFileNameModel = ({ visible, onClose, name, folderId, type, path, isNewFile = true }) => {
    const { addNewFile, isFileExist } = useUser();
    const [newFileName, setNewFileName] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => {
        setNewFileName("");
        setError("");
        onClose();
    }

    const handleChangeFileName = async () => {
        if (!newFileName.trim()) {
            setError("יש להזין שם חדש לקובץ");
            return;
        }
        try {
            if (await isFileExist(folderId, newFileName)) {
                setError("שם קובץ קיים בתיקייה, אנא בחר שם אחר");
                return;
            } else if (isNewFile) {
                await addNewFile(newFileName, folderId, type, path);
            } else {
            }
        } catch (error) {
            console.log(error)
        }
        handleClose();
    };

    const handleRemainName = async () => {
        try {
            if (await isFileExist(folderId, name)) {
                setError("שם קובץ קיים בתיקייה, אנא בחר שם אחר");
                return;
            } else {
                await addNewFile(name, folderId, type, path);
            }
        } catch (error) {
            console.log(error)
        }
        handleClose();
    }


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView style={styles.centeredView}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleClose}
                                >
                                    <Ionicons name="close-outline" size={constats.sizes.icon.default + 4} />
                                </TouchableOpacity>

                                <Text style={styles.modalTitle}>האם ברצונך לשנות שם לקובץ?</Text>

                                <Text style={styles.modalLabel}>שם הקובץ הנוכחי</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={name}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>הכנס שם חדש</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={[
                                            styles.modalInput,
                                            error ? styles.inputErrorBorder : null
                                        ]}
                                        placeholder="הכנס שם לקובץ"
                                        placeholderTextColor="#999"
                                        value={newFileName}
                                        onChangeText={(text) => {
                                            setNewFileName(text);
                                            setError("");
                                        }}
                                    />
                                </View>
                                {error ? (
                                    <Text style={styles.errorText}>{error}</Text>
                                ) : null}

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={handleRemainName}>
                                        <Text style={styles.modalCancelButtonText}>השאר נוכחי</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalSaveButton, !newFileName && styles.disabledButton]}
                                        onPress={handleChangeFileName}
                                        disabled={!newFileName}
                                    >
                                        <Text style={styles.modalSaveButtonText}>החלף</Text>
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

export default ChangeFileNameModel;

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
    disabledButton: theme.modal.disabledButton,
    errorText: {
        color: constats.colors.danger,
        fontSize: constats.sizes.font.small,
        marginTop: -5,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 5,
    },
});
