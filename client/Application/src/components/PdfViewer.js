import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AlertModal from './modals/AlertModal';
import { useConstats } from '../styles/constats';
import { initDB, resetDatabaseState } from '../services/database';

const PdfViewer = ({ base64 }) => {
    const constats = useConstats();
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
        } finally {
            await resetDatabaseState();
            await initDB();
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pdfButton: {
            backgroundColor: constats.colors.white,
            borderWidth: 1.5,
            borderColor: constats.colors.primary,
            borderRadius: 12,
            paddingHorizontal: 32,
            paddingVertical: 16,
            minWidth: 140,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: constats.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        buttonText: {
            color: constats.colors.primary,
            fontSize: constats.sizes.font.medium,
            fontWeight: '600',
            textAlign: 'center',
        },
    });

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.pdfButton}
                    onPress={saveAndOpenPDF}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>פתח PDF</Text>
                </TouchableOpacity>
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

