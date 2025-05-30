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
import { getTheme } from "../../styles/theme";
import VerifyFileNameModal from "./VerifyFileNameModal";
import AlertModal from "./AlertModal";
import { useConstats } from "../../styles/constats";

const CategoryListModel = ({ visible, onClose, attachedFile }) => {
  const constats = useConstats();
  const theme = getTheme(constats);
  const { user } = useUser();
  const [changeFileNameModelVisible, setChangeFileNameModelVisible] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [alert, setAlert] = useState(false);
  const folderNames = Object.keys(user?.folders || {});

  const closeModal = () => {
    setAlert(false);
    onClose();
  };

  const handleFolderSelect = async (folderName) => {
    const folder = user.folders[folderName];
    if (!folder) {
      setAlert(true);
      return;
    }
    setFolderId(folder.id);
    setChangeFileNameModelVisible(true);
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
      fontSize: constats.sizes.font.medium,
      color: "#333",
      textAlign: "right",
    },
    cancelButton: theme.modal.modalCancelButton,
    cancelButtonText: theme.modal.modalCancelButtonText,
    buttonContainer: theme.modal.modalButtonsContainer,
  });

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

      <VerifyFileNameModal
        visible={changeFileNameModelVisible}
        onClose={() => {
          setChangeFileNameModelVisible(false)
          closeModal();
        }}
        name={attachedFile.name}
        folderId={folderId}
        type={attachedFile.mimeType}
        path={attachedFile.uri}
        size={attachedFile.size}
        createDate={attachedFile.createDate}
      />
      <AlertModal
        visible={alert}
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


export default CategoryListModel;
