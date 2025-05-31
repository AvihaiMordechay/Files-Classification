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
import { getTheme } from "../../styles/theme";
import { useUser } from "../../context/UserContext";
import {
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import AlertModal from "./AlertModal";
import * as yup from 'yup';
import { useConstats } from "../../styles/constats";

const emailSchema = yup.string().email("כתובת אימייל לא תקינה").required("יש להזין כתובת אימייל");
const passwordSchema = yup.string()
  .required('יש למלא סיסמה')
  .min(8, 'הסיסמה חייבת להיות באורך של לפחות 8 תווים')
  .matches(/^[A-Za-z0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]*$/, 'הסיסמה חייבת להכיל אותיות באנגלית, מספרים או סימנים מיוחדים בלבד');

const EmailUpdateModal = ({ visible, onClose }) => {
  const constats = useConstats();
  const theme = getTheme(constats);
  const { user } = useUser();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const existEmail = auth.currentUser?.email || "";

  const handleClose = () => {
    setNewEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    onClose();
  };

  const closeModal = () => {
    setModalVisible(false);
    handleClose();
  };

  const handleUpdateEmail = async () => {
    setEmailError("");
    setPasswordError("");

    const firebaseUser = auth.currentUser;

    try {
      if (!firebaseUser) {
        setEmailError("אין משתמש מחובר כרגע");
        return;
      }

      if (newEmail === firebaseUser.email) {
        setEmailError("כתובת האימייל החדשה חייבת להיות שונה מהנוכחית");
        return;
      }

      await emailSchema.validate(newEmail);
      await passwordSchema.validate(password);

      const credential = EmailAuthProvider.credential(firebaseUser.email, password);
      await reauthenticateWithCredential(firebaseUser, credential);

      await verifyBeforeUpdateEmail(firebaseUser, newEmail);

      setModalVisible(true);
    } catch (error) {
      console.log("Email update error:", error);

      if (error.name === "ValidationError") {
        if (error.message.includes("סיסמה")) {
          setPasswordError(error.message);
        } else {
          setEmailError(error.message);
        }
        return;
      }

      switch (error.code) {
        case "auth/email-already-in-use":
          setEmailError("האימייל הזה כבר קיים במערכת");
          break;
        case "auth/invalid-email":
          setEmailError("כתובת אימייל לא חוקית");
          break;
        case "auth/wrong-password":
          setPasswordError("סיסמה שגויה");
          break;
        case "auth/missing-password":
          setPasswordError("חסרה סיסמה");
          break;
        case "auth/user-not-found":
          setEmailError("המשתמש לא נמצא או אינו תואם");
          break;
        case "auth/too-many-requests":
          setPasswordError("יותר מדי ניסיונות כושלים. נסה שוב מאוחר יותר");
          break;
        case "auth/invalid-credential":
          setEmailError("האימייל או הסיסמה אינם חוקיים");
          break;
        default:
          setEmailError("אירעה שגיאה בעדכון האימייל");
      }
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
    errorText: theme.errorText,
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
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
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
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
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
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EmailUpdateModal;
