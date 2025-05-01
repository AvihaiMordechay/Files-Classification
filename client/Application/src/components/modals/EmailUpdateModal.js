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
import {
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import AlertModal from "./AlertModal";

const EmailUpdateModal = ({ visible, onClose }) => {
  const { user } = useUser();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const existEmail = auth.currentUser?.email || "";

  const handleClose = () => {
    setNewEmail("");
    setPassword("");
    onClose();
  };

  const closeModal = () => {
    setModalVisible(false);
    handleClose();
  };

  const handleUpdateEmail = async () => {
    try {
      const firebaseUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        password
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await verifyBeforeUpdateEmail(firebaseUser, newEmail);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      setErrorModalVisible(true);
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
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.modalCancelButtonText}>ביטול</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalSaveButton,
                      !newEmail && styles.disabledButton,
                    ]}
                    onPress={handleUpdateEmail}
                    disabled={!newEmail}
                  >
                    <Text style={styles.modalSaveButtonText}>שמור</Text>
                  </TouchableOpacity>

                  <AlertModal
                    visible={modalVisible}
                    onClose={closeModal}
                    title="אימות נדרש"
                    message="נשלח מייל אימות לכתובת החדשה, אנא אשר את המייל כדי להשלים את העדכון."
                    buttons={[
                      {
                        text: "אישור",
                        onPress: closeModal,
                      },
                    ]}
                  />

                  <AlertModal
                    visible={errorModalVisible}
                    onClose={() => setErrorModalVisible(false)}
                    title="שגיאה"
                    message="לא ניתן לעדכן את האימייל"
                    buttons={[
                      {
                        text: "אישור",
                        onPress: () => setErrorModalVisible(false),
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
});

export default EmailUpdateModal;
