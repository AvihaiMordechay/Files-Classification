import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput, BackHandler } from 'react-native';
import theme from "../../styles/theme";
import { auth } from '../../services/firebase';
import { useUser } from '../../context/UserContext';
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser, signOut } from 'firebase/auth';

const DeleteUserModal = ({ visible, onClose }) => {
    const { setUserStatus, deleteAccount } = useUser();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleUserDelete = async () => {
        if (!password) {
            setError("שדה סיסמה חסר");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("משתמש לא נמצא");

            // Reauthenticate the user to allow deletion
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Delete the DB and local file system.
            await deleteAccount();

            // Delete the user account from firebase.
            await deleteUser(user);

            await signOut(auth);

            setUserStatus("unauthenticated");

            BackHandler.exitApp();
        } catch (error) {
            console.log("Error deleting user:", error);
            setError("אירעה שגיאה בהסרת המשתמש");

            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                setError("הסיסמה שהוזנה שגויה");
            } else if (error.code === "auth/too-many-requests") {
                setError("יותר מדי ניסיונות. נסה שוב מאוחר יותר");
            } else {
                setError("אירעה שגיאה בהסרת המשתמש");
            }
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
                                <Text style={styles.modalTitle}>מחק משתמש</Text>

                                <Text style={styles.modalLabel}>סיסמה לאימות</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס סיסמה"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        value={password}
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <Text style={styles.modalWarningText}>
                                    שים לב! פעולה זו תמחק את החשבון שלך לצמיתות.
                                </Text>

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                        <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalDeleteButton, !password ? styles.disabledButton : {}]}
                                        onPress={handleUserDelete}
                                        disabled={!password}
                                    >
                                        <Text style={styles.modalDeleteButtonText}>מחק</Text>
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

export default DeleteUserModal;

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
    modalDeleteButton: theme.modal.modalSaveButton, // Reusing the save button style for "Delete"
    modalDeleteButtonText: theme.modal.modalSaveButtonText, // Reusing the save button text style
    modalCancelButton: theme.modal.modalCancelButton,
    modalCancelButtonText: theme.modal.modalCancelButtonText,
    disabledButton: theme.modal.disabledButton,
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'right',
    },
    modalWarningText: {
        color: 'red',
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});
