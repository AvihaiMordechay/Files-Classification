import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import constats from '../styles/constats';
import CreateFolderModel from './modals/CreateFolderModal';
import UploadFile from './UploadFile';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';

const OFFSET = 60;

const FloatingActionButton = ({ isExpanded, index, label, icon, myOnPress }) => {
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
        setCreateFolderModalVisible(true);
    };

    const uploadFileFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.log("permission to access the gallery was denied");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {
                const file = {
                    name: result.assets[0]?.fileName || '',
                    uri: result.assets[0]?.uri || '',
                    mimeType: result.assets[0]?.mimeType || '',
                };

                setFile(file);
                console.log("The photo", file);
            } else {
                console.log("the user cancel the action");
            }
        } catch (error) {
            console.error("Problem opening the album ", error);
        }
    };



    const uploadFileFromFiles = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
            });

            if (result.type === 'cancel') {
                console.log("The user cancel the action");
            } else {
                const mimeType = result.assets && result.assets[0] && result.assets[0].mimeType;

                const file = {
                    name: result.assets[0]?.name || '',
                    uri: result.assets[0]?.uri || '',
                    mimeType: mimeType || '',
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
                        console.log("The File:", file);
                    }
                } else {
                    setFile(file);
                    console.log("The File", file);
                }
            }
        } catch (error) {
            console.error("\nProblem opening the file system", error);//TODO: check why if i do cancle in the iphone i get an error Problem opening the file system [TypeError: Cannot convert null value to object]
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
                            />
                            <FloatingActionButton
                                isExpanded={isExpanded}
                                index={2}
                                label={'העלה קובץ מהקבצים'}
                                icon={'cloud-upload-outline'}
                                myOnPress={uploadFileFromFiles}
                            />
                            <FloatingActionButton
                                isExpanded={isExpanded}
                                index={3}
                                label={'העלה קובץ מהגלרייה'}
                                icon={'cloud-upload-outline'}
                                myOnPress={uploadFileFromGallery}
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
        fontSize: 15,
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

export default ActionMenu;