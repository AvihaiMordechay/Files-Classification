import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import theme from '../../styles/theme';
import { useUser } from '../../context/UserContext';

const EmailUpdateModal = ({ visible, onClose }) => {
    const { user } = useUser();
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const existEmail = user.email || '';


    const handleUpdateEmail = async () => {
        setLoading(true);
        try {
            const auth = getAuth();
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                const credential = EmailAuthProvider.credential(firebaseUser.email, password);
                await reauthenticateWithCredential(firebaseUser, credential);
                await verifyBeforeUpdateEmail(firebaseUser, newEmail);

                Alert.alert('אימות נדרש', 'נשלח מייל אימות לכתובת החדשה. אנא אשר את המייל כדי להשלים את העדכון.', [{ text: 'הבנתי', onPress: () => setModalVisible(false) }]);

                const checkEmailVerification = setInterval(async () => {
                    await firebaseUser.reload();
                    if (firebaseUser.emailVerified) {
                        clearInterval(checkEmailVerification);
                        await updateUserEmail(newEmail);
                        setLoading(false);
                        Alert.alert('הצלחה', 'האימייל שלך עודכן בהצלחה!');
                    }
                }, 5000);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('שגיאה', 'לא ניתן לעדכן את האימייל');
            setLoading(false);
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
                    <KeyboardAvoidingView
                        style={styles.centeredView}
                    >
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                <Text style={styles.modalTitle}>עדכון כתובת אימייל</Text>

                                <Text style={styles.modalLabel}>אימייל נוכחי</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={existEmail}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>אימייל חדש</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס אימייל חדש"
                                        placeholderTextColor="#999"
                                        keyboardType="email-address"
                                        onChangeText={setNewEmail}
                                        value={newEmail}
                                    />
                                </View>

                                <Text style={styles.modalLabel}>הכנס סיסמה לאימות</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="הכנס סיסמה"
                                        placeholderTextColor="#999"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        value={password}
                                    />
                                </View>

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                        <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalSaveButton, !newEmail && styles.disabledButton]}
                                        onPress={handleUpdateEmail}
                                        disabled={!newEmail}
                                    >
                                        <Text style={styles.modalSaveButtonText}>שמור</Text>
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

export default EmailUpdateModal;
