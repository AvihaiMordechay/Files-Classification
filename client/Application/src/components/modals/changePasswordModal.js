import React, { useState } from 'react';
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
    Keyboard
} from 'react-native';
import theme from "../../styles/theme";
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

const ForgotPasswordModal = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("הסיסמאות החדשות אינן תואמות");
            return;
        }
        try {
            // ראשית, נבצע התחברות עם המייל והסיסמה הנוכחית
            const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword);
            
            // אם ההתחברות הצליחה, נבצע עדכון סיסמה
            await updatePassword(userCredential.user, newPassword);
            alert("הסיסמה שונתה בהצלחה!");
            onClose();
        } catch (error) {
            alert("שגיאה: " + error.message);
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
                                <Text style={styles.modalTitle}>שחזור סיסמה</Text>

                                <Text style={styles.modalLabel}>אימייל</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס אימייל"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={setEmail}
                                        value={email}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>סיסמה נוכחית</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס סיסמה נוכחית"
                                        secureTextEntry
                                        onChangeText={setCurrentPassword}
                                        value={currentPassword}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>סיסמה חדשה</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס סיסמה חדשה"
                                        secureTextEntry
                                        onChangeText={setNewPassword}
                                        value={newPassword}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>אימות סיסמה חדשה</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="אמת סיסמה חדשה"
                                        secureTextEntry
                                        onChangeText={setConfirmNewPassword}
                                        value={confirmNewPassword}
                                    />
                                </View>

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                        <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalSaveButton, (!email || !currentPassword || !newPassword || !confirmNewPassword) && styles.disabledButton]}
                                        onPress={handleChangePassword}
                                        disabled={!email || !currentPassword || !newPassword || !confirmNewPassword}
                                    >
                                        <Text style={styles.modalSaveButtonText}>אישור</Text>
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

export default ForgotPasswordModal;

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
