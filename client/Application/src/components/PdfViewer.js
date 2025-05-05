import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AlertModal from './modals/AlertModal';

const PdfViewer = ({ base64 }) => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

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
                setAlertTitle('שיתוף לא זמין');
                setAlertMessage('לא ניתן לפתוח את הקובץ באפליקציה חיצונית במכשיר זה.');
                setAlertVisible(true);
            }
        } catch (error) {
            setAlertTitle('שיתוף לא זמין');
            setAlertMessage('לא ניתן לפתוח את הקובץ באפליקציה חיצונית במכשיר זה.');
            setAlertVisible(true);
        }
    };

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="פתח PDF" onPress={saveAndOpenPDF} />
            </View>

            <AlertModal
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
                buttons={[{ text: 'סגור', onPress: () => setAlertVisible(false) }]}
            />
        </>
    );
};

export default PdfViewer;