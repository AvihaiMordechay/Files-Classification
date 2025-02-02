import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const AddFiles = () => {
    const handleFileUpload = async () => {
        try {
<<<<<<< HEAD
            const csrfResponse = await fetch('http://127.0.0.1:8000/csrf/get-token/', {
                method: 'GET',
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrfToken;
            console.log(csrfToken);

            const formData = new FormData();
            const fileUri = require('../../assets/data/image.jpeg');  // קבע את ה-URI של הקובץ
            const file = {
                uri: fileUri,
                type: 'image/jpeg',
                name: 'image.jpeg',
            };

            formData.append('file', file);  // הוסף את הקובץ ל-FormData

            // שלח בקשת POST עם ה-CSRF Token
            const response = await fetch('http://127.0.0.1:8000/file_classifier/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                },
                body: formData,
                credentials: 'include',
=======
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
>>>>>>> avihai
            });

            if (!result.canceled) {
                const file = result.assets[0];

                // Create form data
                const formData = new FormData();
                formData.append('file', {
                    uri: file.uri,
                    type: file.mimeType,
                    name: file.name
                });

                const uploadResponse = await fetch('https://a107-85-64-239-84.ngrok-free.app/file_classifier/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const responseText = await uploadResponse.text();

                if (uploadResponse.ok) {
                    const data = JSON.parse(responseText);
                    Alert.alert('Success', `Category: ${data.category}`);
                } else {
                    throw new Error(responseText || 'Upload failed');
                }
            }
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