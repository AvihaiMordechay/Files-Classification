import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '../context/UserContext';

const AddFiles = () => {
    const { user } = useUser();

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

            if (user.getFoldersNames().includes("רפואה")) {

            } else {
                const wantStr = user.gender === "male" ? "תרצה" : "תרצי";


            }

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
            <Button title="העלה קובץ" onPress={handleFileUpload} />
        </View>
    );
};

export default AddFiles;