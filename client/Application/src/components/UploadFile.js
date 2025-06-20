import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import FileUploadModal from './modals/FileUploadModal';
import CreateFolderModal from './modals/CreateFolderModal';
import CategoryListModel from './modals/CategoryListModel';
import VerifyFileNameModal from './modals/VerifyFileNameModal';
import Spinner from './Spinner';
import AlertModal from './modals/AlertModal';

const UploadFile = ({ file }) => {
  const { user, createNewFolder } = useUser();
  const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
  const [existCategoryModalVisible, setExistCategoryModalVisible] = useState(false);
  const [failedRecognitionModelVisible, setFailedRecognitionModelVisible] = useState(false);
  const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const [categoryListModelVisible, setCategoryListModelVisible] = useState(false);
  const [changeFileNameModelVisible, setChangeFileNameModelVisible] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);
  const hasFolders = user?.folders && Object.keys(user.folders).length > 0;

  useEffect(() => {
    const handleUploadFileToServer = async () => {
      await uploadFileToServer(file);
    };
    handleUploadFileToServer();
  }, [file]);

  const handleFileRecognitionSuccess = (dataCategory) => {
    if (user.folders[dataCategory]) {
      setExistCategoryModalVisible(true);
    } else {
      setNewCategoryModalVisible(true);
    }
  };

  const handleFileRecognitionFailed = () => {
    setFailedRecognitionModelVisible(true);
  };

  const handleButtonPress = async (action, modal) => {
    switch (action) {
      case 'createNewFolder':
        setCreateFolderModalVisible(true);
        break;
      case 'saveToExisting':
        setCategoryListModelVisible(true);
        break;
      case 'createCategoryFolder':
        const id = await createNewFolder(category, false);
        setFolderId(id);
        if (id) {
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
        }
        break;
      case 'saveToExistingCategory':
        setFolderId(user.folders[category].id);
        setChangeFileNameModelVisible(true);
        break;
    }

    switch (modal) {
      case 'existCategoryModal':
        setExistCategoryModalVisible(false);
        break;
      case 'newCategoryModal':
        setNewCategoryModalVisible(false);
        break;
      case 'failedRecognitionModel':
        setFailedRecognitionModelVisible(false);
    }
  };

  const uploadFileToServer = async (file) => {
    try {
      setLoading(true);
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });
      const uploadResponse = await fetch(
        'http://10.0.2.2:8000/file_classifier/',
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setLoading(false);
      const responseText = await uploadResponse.text();

      if (uploadResponse.ok) {
        const data = JSON.parse(responseText);
        if (!data.category || data.category === 'undefined') {
          handleFileRecognitionFailed();
        } else {
          setCategory(data.category);
          handleFileRecognitionSuccess(data.category);
        }
      } else {
        handleFileRecognitionFailed();
      }
    } catch (error) {
      console.log('Upload error:', error);
      setLoading(false);
      handleFileRecognitionFailed();
    }
  };

  return (
    <>
      <Spinner
        visible={loading}
        text='מזהה את סוג המסמך...'
        isUploadFile={true}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FileUploadModal
          visible={newCategoryModalVisible}
          content={`המערכת זיהתה מסמך מקטגוריה חדשה בשם: ${category}, מה ברצונך לעשות?`}
          buttons={[
            {
              text: 'צור תיקייה חדשה',
              icon: 'add-outline',
              onPress: () =>
                handleButtonPress('createNewFolder', 'newCategoryModal'),
            },
            ...(hasFolders
              ? [{
                icon: 'save-outline',
                text: 'שמור בתיקייה קיימת',
                onPress: () =>
                  handleButtonPress('saveToExisting', 'newCategoryModal'),
              }]
              : []),
            {
              icon: 'folder-outline',
              isPrimary: true,
              text: `צור תיקייה ${category}`,
              onPress: () =>
                handleButtonPress('createCategoryFolder', 'newCategoryModal'),
            },
          ]}
          onClose={() => setNewCategoryModalVisible(false)}
        />
        <FileUploadModal
          visible={existCategoryModalVisible}
          content={`המערכת זיהתה מסמך מקטגורית: ${category}, מה ברצונך לעשות?`}
          buttons={[
            {
              text: 'צור תיקייה חדשה',
              icon: 'add-outline',
              onPress: () =>
                handleButtonPress('createNewFolder', 'existCategoryModal'),
            },
            ...(hasFolders
              ? [{
                icon: 'save-outline',
                text: 'שמור בתיקייה קיימת',
                onPress: () =>
                  handleButtonPress('saveToExisting', 'newCategoryModal'),
              }]
              : []),
            {
              icon: 'save-outline',
              isPrimary: true,
              text: `שמור בתיקיית ${category}`,
              onPress: () =>
                handleButtonPress(
                  'saveToExistingCategory',
                  'existCategoryModal'
                ),
            },
          ]}
          onClose={() => setExistCategoryModalVisible(false)}
        />
        <FileUploadModal
          visible={failedRecognitionModelVisible}
          content={'לא הצלחנו לזהות את סוג המסמך. מה ברצונך לעשות?'}
          buttons={[
            {
              text: 'צור תיקייה חדשה',
              icon: 'add-outline',
              onPress: () =>
                handleButtonPress('createNewFolder', 'failedRecognitionModel'),
            },
            ...(hasFolders
              ? [{
                icon: 'save-outline',
                text: 'שמור בתיקייה קיימת',
                onPress: () =>
                  handleButtonPress('saveToExisting', 'newCategoryModal'),
              }]
              : []),
          ]}
          onClose={() => setFailedRecognitionModelVisible(false)}
        />
        {createFolderModalVisible && (
          <CreateFolderModal
            visible={createFolderModalVisible}
            onClose={() => setCreateFolderModalVisible(false)}
            attachedFile={file}
          />
        )}

        {categoryListModelVisible && (
          <CategoryListModel
            visible={categoryListModelVisible}
            onClose={() => setCategoryListModelVisible(false)}
            attachedFile={file}
          />
        )}

        {alertVisible && (
          <AlertModal
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            buttons={alertButtons}
          />
        )}
      </View>

      {changeFileNameModelVisible && (
        <VerifyFileNameModal
          visible={changeFileNameModelVisible}
          onClose={() => setChangeFileNameModelVisible(false)}
          name={file.name}
          folderId={folderId}
          type={file.mimeType}
          path={file.uri}
          size={file.size}
          createDate={file.createDate}
        />
      )}

    </>
  );
};

export default UploadFile;
