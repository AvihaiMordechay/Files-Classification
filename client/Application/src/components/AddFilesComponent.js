import { View, Button, Alert } from 'react-native';

const AddFiles = () => {
    const handleFileUpload = async () => {
        try {
            const csrfResponse = await fetch('http://127.0.0.1:8000/csrf/get-token/', {
                method: 'GET',
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrfToken;
            console.log(csrfToken);

            const formData = new FormData();
            const fileUri = require('../../assets/image.jpeg');
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
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert('הקובץ הועלה בהצלחה!', JSON.stringify(data));
            } else {
                throw new Error('שגיאה בהעלאת הקובץ');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('שגיאה בהעלאת הקובץ', error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="העלה קובץ" onPress={handleFileUpload} />
        </View>
    );
};

export default AddFiles;
