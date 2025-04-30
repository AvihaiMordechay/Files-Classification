import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useUser } from "../../context/UserContext";
import theme from "../../styles/theme";
import ChangeFileNameModel from "./ChangeFileNameModel";
import AlertModal from "./AlertModal";

const CategoryListModel = ({ visible, onClose, attachedFile }) => {
  const { user } = useUser();
  const [changeFileNameModelVisible, setChangeFileNameModelVisible] =
    useState(false);
  const [folderId, setFolderId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };
  const handleFolderSelect = async (folderName) => {
    const folder = user.folders[folderName];
    if (!folder) {
      setModalVisible(true); //setting the alertModel
      return;
    }
    setFolderId(folder.id);
    setChangeFileNameModelVisible(true);
    onClose();
  };
  const folderNames = Object.keys(user?.folders || {});

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.title}>בחר תיקייה לשמירת הקובץ</Text>

              <ScrollView style={styles.folderList}>
                {folderNames.map((folderName, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.folderItem}
                    onPress={() => handleFolderSelect(folderName)}
                  >
                    <Text style={styles.folderText}>{folderName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>ביטול</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ChangeFileNameModel
        visible={changeFileNameModelVisible}
        onClose={() => setChangeFileNameModelVisible(false)}
        name={attachedFile.name}
        folderId={folderId}
        type={attachedFile.mimeType}
        path={attachedFile.uri}
      />
      <AlertModal
        visible={modalVisible}
        onClose={closeModal}
        title="שגיאה"
        message="התייקיה לא קיימת"
        buttons={[
          {
            text: "סגור",
            onPress: closeModal,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: theme.modal.modalOverlay,
  modalView: {
    ...theme.modal.modalView,
    width: "85%",
    maxHeight: "80%",
    padding: 20,
  },
  title: {
    ...theme.modal.modalTitle,
    marginBottom: 20,
  },
  folderList: {
    marginBottom: 20,
  },
  folderItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
  },
  folderText: {
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  cancelButton: theme.modal.modalCancelButton,
  cancelButtonText: theme.modal.modalCancelButtonText,
  buttonContainer: theme.modal.modalButtonsContainer,
});

export default CategoryListModel;
