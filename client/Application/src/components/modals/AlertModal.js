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
import constats from "../../styles/constats";

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
                      style={[
                        styles.modalButton,
                        buttons.length > 1 && index === 0 && styles.modalCancelButton
                      ]}
                      onPress={button.onPress}
                    >
                      <Text style={[
                        styles.modalButtonText,
                        buttons.length > 1 && index === 0 && styles.modalCancelButtonText
                      ]}>
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
  modalTitle: {
    fontSize: constats.sizes.font.mediumPlus,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalMessage: {
    fontSize: constats.sizes.font.medium,
    marginBottom: 8,
    textAlign: 'right',
    color: '#333',
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    backgroundColor: constats.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    height: 50,
    flex: 1,
    maxWidth: 200,
  },
  modalButtonText: theme.modal.modalSaveButtonText,
  modalCancelButton: {
    backgroundColor: constats.colors.backgroundButton
  },
  modalCancelButtonText: {
    color: "#000"
  }
});
