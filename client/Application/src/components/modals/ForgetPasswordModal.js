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
import { Formik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import theme from "../../styles/theme";
import constats from "../../styles/constats";

const ForgetPasswordModal = ({ visible, onClose }) => {
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("כתובת מייל לא תקינה")
      .required("יש להזין כתובת מייל"),
  });

  const handleResetPassword = async (values, { setSubmitting }) => {
    setGeneralError("");
    setSuccessMessage("");
    try {
      auth.languageCode = "he";
      await sendPasswordResetEmail(auth, values.email);
      setSuccessMessage("נשלח מייל לשחזור הסיסמה");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setGeneralError("המשתמש לא קיים במערכת");
      } else {
        setGeneralError("אירעה שגיאה בעת שליחת האימייל. נסה שוב.");
      }
    } finally {
      setSubmitting(false);
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
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
            >
              <Pressable
                style={styles.modalView}
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={styles.modalTitle}>שחזור סיסמה</Text>

                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleResetPassword}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <>
                      <Text style={styles.modalLabel}>אימייל</Text>
                      <View style={styles.modalInputContainer}>
                        <TextInput
                          style={styles.modalInput}
                          placeholder="הכנס מייל"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                        />
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                      {generalError !== "" && (
                        <Text style={styles.errorText}>{generalError}</Text>
                      )}
                      {successMessage !== "" && (
                        <Text style={styles.successText}>{successMessage}</Text>
                      )}

                      <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity
                          style={styles.modalCancelButton}
                          onPress={onClose}
                        >
                          <Text style={styles.modalCancelButtonText}>סגור</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.modalSaveButton,
                            isSubmitting && styles.disabledButton,
                          ]}
                          onPress={handleSubmit}
                          disabled={isSubmitting}
                        >
                          <Text style={styles.modalSaveButtonText}>
                            שלח קישור
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ForgetPasswordModal;

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
    color: "red",
    fontSize: constats.sizes.font.small,
    textAlign: "right",
    marginBottom: 8,
    marginTop: 4,
  },
  successText: {
    color: "green",
    fontSize: constats.sizes.font.small,
    textAlign: "right",
    marginBottom: 8,
    marginTop: 4,
  },
});
