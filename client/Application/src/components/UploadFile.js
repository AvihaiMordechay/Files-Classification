import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '../context/UserContext';
import FileUploadModal from './modals/FileUploadModal';

const UploadFile = () => {
    const { user } = useUser();
    const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
    const [existCategoryModalVisible, setExistCategoryModalVisible] = useState(false);
    const [failedRecognitionModelVisible, setFailedRecognitionModelVisible] = useState(false);
    const [category, setCategory] = useState(undefined);

    const handleFileRecognitionSuccess = async () => {
        if (user.folders[category]) {
            setExistCategoryModalVisible(true);
        } else {
            setNewCategoryModalVisible(true);
        }
    };

    const handleFileRecognitionFailed = async () => {
        setNewCategoryModalVisible(true);
    }

    const handleButtonPress = (action, modal) => {
        console.log(`Action selected: ${action}`);
        console.log(`model selected: ${modal}`);
        switch (action) {
            case "createNewFolder":

                break;
            case "saveToExisting":

                break;
            case "createCategoryFolder":

                break;
            case "saveToExistingCategory":

                break;
        }

        switch (modal) {
            case "existCategoryModal":
                setExistCategoryModalVisible(false);
                break;
            case "newCategoryModal":
                setNewCategoryModalVisible(false);
                break;
            case "failedRecognitionModel":
                setFailedRecognitionModelVisible(false);
        }
    };

    const handleFileUpload = async () => {
        try {
            // const result = await DocumentPicker.getDocumentAsync({
            //     type: 'image/*'
            // });

            // if (!result.canceled) {
            // const file = result.assets[0];

            // // Create form data
            // const formData = new FormData();
            // formData.append('file', {
            //     uri: file.uri,
            //     type: file.mimeType,
            //     name: file.name
            // });

            // const uploadResponse = await fetch('https://a107-85-64-239-84.ngrok-free.app/file_classifier/', {
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            // const responseText = await uploadResponse.text();

            // if (uploadResponse.ok) {
            // const data = JSON.parse(responseText);
            // const category = data.category;

            // if (user.getFoldersNames().includes("רפואה")) {

            // } else {
            //     const wantStr = user.gender === "male" ? "תרצה" : "תרצי";


            // }

            // Alert.alert('Success', `Category: ${data.category}`);
            // } else {
            //     throw new Error(responseText || 'Upload failed');
            // }
            // }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="העלה קובץ" onPress={() => { handleFileRecognitionFailed() }} />

            <FileUploadModal
                visible={newCategoryModalVisible}
                content={`המערכת זיהתה מסמך מקטגוריה חדשה בשם: ${category}, מה ברצונך לעשות?`}
                buttons={[
                    {
                        text: 'צור תיקייה חדשה',
                        icon: 'add-outline',
                        onPress: () => handleButtonPress('createNewFolder', "newCategoryModal"),
                    },
                    {
                        icon: 'save-outline',
                        text: 'שמור בתיקייה אחרת',
                        onPress: () => handleButtonPress('saveToExisting', "newCategoryModal"),
                    },
                    {
                        icon: 'folder-outline',
                        isPrimary: true,
                        text: `צור תיקייה ${category}`,
                        onPress: () => handleButtonPress('createCategoryFolder', "newCategoryModal"),
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
                        onPress: () => handleButtonPress('createNewFolder', "existCategoryModal"),
                    },
                    {
                        icon: 'save-outline',
                        text: 'שמור בתיקייה אחרת',
                        onPress: () => handleButtonPress('saveToExisting', "existCategoryModal"),
                    },
                    {
                        icon: 'save-outline',
                        isPrimary: true,
                        text: `שמור בתיקיית ${category}`,
                        onPress: () => handleButtonPress('saveToExistingCategory', "existCategoryModal"),
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
                        onPress: () => handleButtonPress('createNewFolder', "failedRecognitionModel"),
                    },
                    {
                        icon: 'save-outline',
                        text: 'שמור בתיקייה קיימת',
                        onPress: () => handleButtonPress('saveToExisting', "failedRecognitionModel"),
                    },
                ]}
                onClose={() => setFailedRecognitionModelVisible(false)}
            />
        </View>
    );
};

export default UploadFile;