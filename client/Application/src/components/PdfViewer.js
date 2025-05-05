import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PdfViewer = ({ base64 }) => {
    const saveAndOpenPDF = async () => {
        try {
            const fileUri = FileSystem.cacheDirectory + 'document.pdf';

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'צפייה במסמך PDF',
                });
            } else {
                Alert.alert('שיתוף לא זמין', 'לא ניתן לפתוח את הקובץ באפליקציה חיצונית במכשיר זה.');
            }
        } catch (error) {
            console.error('שגיאה בפתיחת ה-PDF:', error);
            Alert.alert('שגיאה', 'אירעה שגיאה בעת פתיחת הקובץ.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="פתח PDF" onPress={saveAndOpenPDF} />
        </View>
    );
};

export default PdfViewer;