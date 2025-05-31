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

const OFFSET = 60;

const FloatingActionButton = ({ isExpanded, index, label, icon, myOnPress, styles }) => {
    const constats = useConstats();
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: isExpanded ? -OFFSET * index : 0,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: isExpanded ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isExpanded]);

    return (
        <Animated.View style={[{ transform: [{ translateY }, { scale }] }, styles.floatingButtonContainer]}>
            <View style={styles.buttonView}>
                <Text style={styles.label}>{label}</Text>
                <Pressable onPress={myOnPress} style={[styles.button, styles.shadow]}>
                    <Ionicons name={icon} size={constats.sizes.icon.default + 4} />
                </Pressable>
            </View>
        </Animated.View>
    );
};

const ActionMenu = () => {
    const constats = useConstats();
    const [isExpanded, setIsExpanded] = useState(false);
    const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handlePlusPress = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleCreateFolderPress = () => {
        setIsExpanded(false);
        handlePlusPress();
        setCreateFolderModalVisible(true);
    };

    const uploadFileFromGallery = async () => {
        setIsExpanded(false);
        handlePlusPress();
        try {
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
        setIsExpanded(false);
        handlePlusPress();
        try {
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

    const rotateStyle = {
        transform: [
            {
                rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                }),
            },
            {
                translateX: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2],
                }),
            },
        ],

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

    const mainButtonStyles = StyleSheet.create({
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
        content: {
            fontSize: 50,
            color: '#f8f9ff',
            marginTop: -3,
        },
    });

    const styles = StyleSheet.create({
        mainContainer: {
            position: 'relative',
            height: 50,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        floatingButtonContainer: {
            position: 'absolute',
        },
        button: {
            width: 50,
            height: 50,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            zIndex: -2,
        },
        buttonView: {
            backgroundColor: '#F5FDFEFF',
            marginLeft: -70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingStart: 8,
            borderRadius: 100,
            overflow: 'hidden',
        },
        label: {
            writingDirection: 'rtl',
            textAlign: 'right',
            marginRight: 6,
            fontSize: constats.sizes.font.medium + 1,
            fontWeight: 'bold',
            color: '#595959FF',
        },
        buttonContainer: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        shadow: {
            shadowColor: '#313131FF',
            shadowOffset: { width: -0.5, height: 3.5 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        content: {
            color: constats.colors.primary,
            fontWeight: '500',
        },
    });

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={handlePlusPress} style={[styles.shadow, mainButtonStyles.button]}>
                        <Animated.Text style={[rotateStyle, mainButtonStyles.content]}>+</Animated.Text>
                    </Pressable>

                    {isExpanded && (
                        <>
                            <FloatingActionButton
                                isExpanded={isExpanded}
                                index={1}
                                label={'צור תיקייה \nחדשה'}
                                icon={'folder-outline'}
                                myOnPress={handleCreateFolderPress}
                                styles={styles}
                            />
                            <FloatingActionButton
                                isExpanded={isExpanded}
                                index={2}
                                label={'העלה קובץ מהקבצים'}
                                icon={'cloud-upload-outline'}
                                myOnPress={uploadFileFromFiles}
                                styles={styles}
                            />
                            <FloatingActionButton
                                isExpanded={isExpanded}
                                index={3}
                                label={'העלה קובץ מהגלרייה'}
                                icon={'cloud-upload-outline'}
                                myOnPress={uploadFileFromGallery}
                                styles={styles}
                            />
                        </>
                    )}
                </View>
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