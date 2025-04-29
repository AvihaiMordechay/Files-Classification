import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import theme from "../../styles/theme";

const AlertModal = ({ visible, onClose, title, message, buttons }) => {
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
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalMessage}>{message}</Text>
                <View style={styles.modalButtonsContainer}>
                  {buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.modalButton, button.style]}
                      onPress={button.onPress}
                    >
                      <Text style={styles.modalButtonText}>
                        {button.text ? String(button.text) : "לחץ כאן"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "50%",
    },
    scrollViewContent: theme.modal.scrollViewContent,
    modalView: {
      ...theme.modal.modalView,
      width: 350,
      padding: 20,
    },
    modalTitle: theme.modal.modalTitle,
    modalMessage: theme.modal.modalLabel,
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      gap: 10,
    },
    modalButton: {
      ...theme.modal.modalSaveButton,
      height: 50,
      flex: 1,
      maxWidth: 200,
    },
    modalButtonText: theme.modal.modalSaveButtonText,
  });
  