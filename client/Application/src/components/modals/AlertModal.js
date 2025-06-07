import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { getTheme } from "../../styles/theme";
import { useConstats } from "../../styles/constats";

const AlertModal = ({ visible, onClose, title, message, buttons }) => {
  const constats = useConstats();
  const theme = getTheme(constats);


  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    modalView: {
      ...theme.modal.modalView,
      width: 350,
      padding: 24,
      backgroundColor: '#fff',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: constats.sizes.font.mediumPlus,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    modalMessage: {
      fontSize: constats.sizes.font.medium + 2,
      marginBottom: 30,
      marginTop: 20,
      textAlign: 'center',
      color: '#333',
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    modalButton: {
      backgroundColor: constats.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      height: 50,
      maxWidth: 150,
      flex: 1,
    },
    modalButtonText: theme.modal.modalSaveButtonText,
    modalCancelButton: {
      backgroundColor: constats.colors.backgroundButton
    },
    modalCancelButtonText: {
      color: "#000"
    }
  });
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView style={styles.centeredView} behavior="padding">
            <Pressable
              style={styles.modalView}
              onPress={(e) => e.stopPropagation()}
            >
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
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

  );
};

export default AlertModal;


