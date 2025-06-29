import React, { useState } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    Pressable, StyleSheet, KeyboardAvoidingView,
    ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { getTheme } from "../../styles/theme";
import { useConstats } from '../../styles/constats';
import { useUser } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as yup from 'yup';

const letterLimit = 10;

const schema = yup.object().shape({
    newFileName: yup
        .string()
        .required("יש להזין שם חדש לקובץ")
        .max(letterLimit, "שם הקובץ חורג מהגודל המותר")
});

const VerifyFileNameModal = ({ visible, onClose, name, folderId, type, path, size, createDate, isNewFile = true }) => {
    const constats = useConstats();
    const theme = getTheme(constats);
    const { addNewFile, isFileExist } = useUser();
    const [newFileName, setNewFileName] = useState("");
    const [error, setError] = useState("");

    const isExistNameTooLong = name.length > letterLimit;

    const handleClose = () => {
        setNewFileName("");
        setError("");
        onClose();
    }

    const handleChangeFileName = async () => {
        try {
            await schema.validate({ newFileName });
            if (await isFileExist(folderId, newFileName)) {
                setError("שם קובץ קיים בתיקייה, אנא בחר שם אחר");
                return;
            }

            if (isNewFile) {
                await addNewFile(newFileName, folderId, type, size, createDate, path);
            }

            handleClose();
        } catch (validationError) {
            setError(validationError.message);
        }
    };

    const handleRemainName = async () => {
        if (isExistNameTooLong) {
            setError("שם הקובץ הנוכחי ארוך מדי. נא להזין שם חדש.");
            return;
        }

        try {
            if (await isFileExist(folderId, name)) {
                setError("שם קובץ קיים בתיקייה, אנא בחר שם אחר");
                return;
            }
            await addNewFile(name, folderId, type, size, createDate, path);
            handleClose();
        } catch (error) {
            console.log(error);
            setError("שגיאה בלתי צפויה");
        }
    };


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
                                    <TouchableOpacity
                                        style={styles.modalCancelButton}
                                        onPress={handleRemainName}
                                    >
                                        <Text style={styles.modalCancelButtonText}>השאר נוכחי</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.modalSaveButton,
                                            (!newFileName || newFileName.length > letterLimit) && styles.disabledButton
                                        ]}
                                        onPress={handleChangeFileName}
                                        disabled={!newFileName || newFileName.length > letterLimit}
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

export default VerifyFileNameModal;
