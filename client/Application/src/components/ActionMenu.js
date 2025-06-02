import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConstats } from '../styles/constats';
import CreateFolderModel from './modals/CreateFolderModal';
import UploadFile from './UploadFile';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { initDB, resetDatabaseState } from '../services/database';
import FileUploadModal from './modals/FileUploadModal';


const ActionMenu = () => {
    const constats = useConstats();
    const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);

    const uploadModalButtons = [
        {
            text: "העלה תמונה מהגלריה",
            icon: "image-outline",
            onPress: () => uploadFileFromGallery(),
        },
        {
            text: "העלה תמונה מהקבצים",
            icon: "document-outline",
            onPress: () => uploadFileFromFiles(),
        },
        {
            text: "צור תיקייה חדשה",
            icon: "folder-outline",
            onPress: () => handleCreateFolderPress(),
        },
    ];

    const handleCreateFolderPress = () => {
        setActionModalVisible(false);
        setCreateFolderModalVisible(true);
    };

    const uploadFileFromGallery = async () => {
        try {
            setActionModalVisible(false);
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            await resetDatabaseState();
            await initDB();
            if (status !== 'granted') {
                console.log("permission to access the gallery was denied");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {
                const size = formatFileSize(result.assets[0]?.fileSize);

                const file = {
                    name: result.assets[0]?.fileName || '',
                    uri: result.assets[0]?.uri || '',
                    mimeType: result.assets[0]?.mimeType || '',
                    size: size || '',
                    createDate: new Date().toISOString(),
                };

                setFile(file);
            }
        } catch (error) {
            console.log("Problem opening the album ", error);
        }
    };



    const uploadFileFromFiles = async () => {
        try {
            setActionModalVisible(false);
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
            });
            await resetDatabaseState();
            await initDB();

            if (result.type === 'cancel') {
                console.log("The user cancel the action");
            } else {
                const mimeType = result.assets && result.assets[0] && result.assets[0].mimeType;
                const size = formatFileSize(result.assets[0]?.size);

                const file = {
                    name: result.assets[0]?.name || '',
                    uri: result.assets[0]?.uri || '',
                    mimeType: mimeType || '',
                    size: size || '',
                    createDate: new Date().toISOString(),
                };

                if (mimeType === "application/pdf") {
                    const uri = result.assets[0].uri;

                    const pdfBytes = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

                    const numPages = pdfDoc.getPageCount();

                    if (numPages > 1) {
                        console.log("The user choose a PDF file with more than one page.");
                        return;
                    } else {
                        setFile(file);
                    }
                } else {
                    setFile(file);
                }
            }
        } catch (error) {
            console.log("\nProblem opening the file system", error);//TODO: check why if i do cancle in the iphone i get an error Problem opening the file system [TypeError: Cannot convert null value to object]
        }
    };

    const formatFileSize = (sizeInBytes) => {
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (sizeInBytes < kb * 1000) {
            return `${(sizeInBytes / kb).toFixed(0)} kb`;
        } else if (sizeInBytes < mb * 1000) {
            return `${(sizeInBytes / mb).toFixed(1)} mb`;
        } else {
            return `${(sizeInBytes / gb).toFixed(1)} gb`;
        }
    };

    const styles = StyleSheet.create({
        mainContainer: {
            position: 'relative',
            height: '90%',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        button: {
            zIndex: 1,
            height: 70,
            width: 70,
            borderRadius: 100,
            backgroundColor: constats.colors.primary,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonContainer: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            bottom: 15
        },
        content: {
            fontSize: 50,
            color: '#f8f9ff',
            marginTop: -3,
        },
    });

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => setActionModalVisible(true)} style={styles.button}>
                        <Text style={styles.content}>+</Text>
                    </Pressable>
                </View>

                <FileUploadModal
                    visible={actionModalVisible}
                    content="בחר פעולה שברצונך לבצע"
                    buttons={uploadModalButtons}
                    onClose={() => setActionModalVisible(false)}
                />
            </View>

            <CreateFolderModel
                visible={createFolderModalVisible}
                onClose={() => setCreateFolderModalVisible(false)}
            />

            {file && <UploadFile file={file} />}
        </SafeAreaView>
    );
};

export default ActionMenu;