import React, { useState } from 'react';
import {
  Modal,
  Alert,
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
} from 'react-native';
import AlertModal from "./AlertModal";
import theme from '../../styles/theme';
import { useUser } from '../../context/UserContext';
import constats from '../../styles/constats';
import VerifyFileNameModal from './VerifyFileNameModal';

const CreateFolderModal = ({ visible, onClose, attachedFile = null }) => {
  const { createNewFolder } = useUser();
  const [newFolderName, setNewFolderName] = useState('');
  const [changeFileNameModelVisible, setChangeFileNameModelVisible] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [folderId, setFolderId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  const handleClose = () => {
    setNewFolderName('');
    setFolderError('');
    onClose();
  };
  const handleNewFolder = async () => {
    setFolderError('');
    if (!newFolderName.trim()) {
      setFolderError('יש להזין שם תיקייה');
      return;
    } else if (newFolderName.trim().length > 20) {
      setFolderError('שם התיקייה חורג מהגודל המותר');
      return;
    }

    try {
      if (attachedFile) {
        const id = await createNewFolder(newFolderName.trim(), false);
        setFolderId(id);
        setAlertTitle('צרף קובץ');
        setAlertMessage('האם לצרף את הקובץ לתיקייה החדשה?');
        setAlertButtons([
          {
            text: 'לא',
            onPress: () => setAlertVisible(false),
          },
          {
            text: 'כן',
            onPress: () => {
              setAlertVisible(false);
              setChangeFileNameModelVisible(true);
            },
          },
        ]);
        setAlertVisible(true);
      } else {
        const id = await createNewFolder(newFolderName);
        setFolderId(id);
      }
      handleClose();
    } catch (error) {
      if (error.message === 'already exist') {
        setFolderError(`התיקייה כבר קיימת במערכת`);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <>
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
                  <Text style={styles.modalTitle}>צור תיקייה חדשה</Text>

                  <Text style={styles.modalLabel}>שם התיקייה</Text>
                  <View style={styles.modalInputContainer}>
                    <TextInput
                      style={[
                        styles.modalInput,
                        folderError ? styles.inputErrorBorder : null,
                      ]}
                      placeholder="הכנס שם לתיקייה"
                      placeholderTextColor="#999"
                      value={newFolderName}
                      onChangeText={(text) => {
                        setNewFolderName(text);
                        setFolderError('');
                      }}
                    />
                  </View>
                  {folderError ? (
                    <Text style={styles.errorText}>{folderError}</Text>
                  ) : null}

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
                        !newFolderName && styles.disabledButton,
                      ]}
                      onPress={handleNewFolder}
                      disabled={!newFolderName}
                    >
                      <Text style={styles.modalSaveButtonText}>צור</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </ScrollView>
            </KeyboardAvoidingView>
            <AlertModal
              visible={alertVisible}
              title={alertTitle}
              message={alertMessage}
              buttons={alertButtons}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {attachedFile && (
        <VerifyFileNameModal
          visible={changeFileNameModelVisible}
          onClose={() => setChangeFileNameModelVisible(false)}
          name={attachedFile.name}
          folderId={folderId}
          type={attachedFile.mimeType}
          path={attachedFile.uri}
        />
      )}
    </>
  );
};

export default CreateFolderModal;

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
    color: constats.colors.danger,
    fontSize: constats.sizes.font.small,
    marginTop: -5,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
