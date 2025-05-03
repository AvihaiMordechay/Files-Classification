import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import theme from "../../styles/theme";
import { useUser } from "../../context/UserContext";
import AlertModal from "./AlertModal";

const ChangeFileNameModal = ({ visible, onClose, fileId, folderName }) => {
    const { user } = useUser();
    const [newName, setNewName] = useState("");
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [error, setError] = useState("");
    const existFileName = user.folders[folderName].files[fileId].name;


    const handleClose = () => {
        setNewName("");
        setError("");
        onClose();
    };

    const closeAlertModal = () => {
        setAlertModalVisible(false);
        handleClose();
    };

    const handleUpdateName = async () => {
        setError("");
        try {

        } catch (error) {

        }
    };

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
                        <ScrollView
                            contentContainerStyle={styles.scrollViewContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Pressable
                                style={styles.modalView}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={styles.modalTitle}>שינוי שם קובץ</Text>

                                <Text style={styles.modalLabel}>שם קובץ נוכחי</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={existFileName}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>שם קובץ חדש</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס שם חדש"
                                        placeholderTextColor="#999"
                                        keyboardType="default"
                                        onChangeText={setNewName}
                                        value={newName}
                                    />
                                    {error ? (
                                        <Text style={styles.errorText}>{error}</Text>
                                    ) : null}
                                </View>


                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.modalCancelButton}
                                        onPress={handleClose}
                                    >
                                        <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.modalSaveButton,
                                            !newName && styles.disabledButton,
                                        ]}
                                        onPress={handleUpdateName}
                                        disabled={!newName}
                                    >
                                        <Text style={styles.modalSaveButtonText}>שמור</Text>
                                    </TouchableOpacity>

                                    <AlertModal
                                        visible={alertModalVisible}
                                        onClose={closeAlertModal}
                                        title="הודעה"
                                        message="השם עודכן בהצלחה"
                                        buttons={[
                                            {
                                                text: "אישור",
                                                onPress: closeAlertModal,
                                            },
                                        ]}
                                    />
                                </View>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
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
    errorText: theme.errorText,
});

export default ChangeFileNameModal;
