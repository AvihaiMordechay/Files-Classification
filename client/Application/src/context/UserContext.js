import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import {
    getUserDetails,
    changeUserName,
    isFirstTime,
    getFoldersDetails,
    getFilesByFolder,
    createDB,
    getLastLogin,
    deleteDB,
    createFolder,
    addFileToFolder,
    printDB,
} from '../services/database';
import { Alert } from 'react-native';
import { saveFileToAppStorage } from '../services/localFileSystem';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (await isFirstTime()) {
                setUser(null);
                setUserStatus('new');
            } else if ((firebaseUser !== null) && await isUserLoggedIn()) {
                try {
                    await loadUser();
                    setUserStatus('authenticated');
                } catch (error) {
                    setUserStatus('unauthenticated');
                }
            } else {
                setUser(null);
                setUserStatus('unauthenticated');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isUserLoggedIn = async () => {
        try {
            const lastLogin = await getLastLogin();
            if (!lastLogin) return false;

            const lastLoginDate = new Date(lastLogin);
            const now = new Date();

            const diffInMs = now - lastLoginDate;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            return diffInHours <= 3;
        } catch (error) {
            return false;
        }
    };

    const loadUser = async () => {
        try {
            const userDetails = await getUserDetails();
            const folders = await loadFoldersFromDB();
            setUser({
                id: userDetails.id,
                name: userDetails.name,
                gender: userDetails.gender,
                folders: folders,
                imgPath: null,
            });
        } catch (error) {
            console.error("Error loading user:", error);
            throw error;
        }
    }

    const createUser = async (id, name, gender) => {
        try {
            await createDB(id, name, gender);
        } catch (error) {
            Alert.alert('שגיאה', "לא ניתן להירשם כעת, אנא נסה שנית");
            throw error;
        }
    };

    const loadFoldersFromDB = async () => {
        let foldersDetails = [];
        try {
            foldersDetails = await getFoldersDetails();
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן לגשת לנתוני המשתמש");
            return [];
        }

        const folders = await Promise.all(
            foldersDetails.map(async (folder) => {
                let files = [];
                try {
                    files = await getFilesByFolder(folder.id);
                } catch (error) {
                    console.error("Error loading files for folder", folder.id, error);
                    files = [];
                }
                return {
                    [folder.name]: {
                        id: folder.id,
                        filesCount: folder.filesCount,
                        files: files
                    }
                };
            })
        );

        return Object.assign({}, ...folders);
    };

    const updateUserName = async (newName) => {
        if (!user) return;
        try {
            await changeUserName(newName, user.id);
            setUser((prevUser) => ({ ...prevUser, name: newName }));
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן לעדכן את שם המשתמש");
        }
    };

    const createNewFolder = async (newName) => {
        if (!user) return;
        try {
            if (user.folders[newName]) {
                Alert.alert("שגיאה", `התיקייה ${newName} כבר קיימת במערכת, אנא בחר שם אחר`);
            } else {
                const folderId = await createFolder(newName);
                setUser((prevUser) => ({
                    ...prevUser,
                    folders: {
                        ...prevUser.folders,
                        [newName]: {
                            id: folderId,
                            filesCount: 0,
                            files: [],
                        },
                    },
                }));
            }
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן לפתוח תיקייה חדשה");
        }
    }

    const addNewFile = async (name, folderId, type, tempPath) => {
        if (!user) return;
        try {
            const newPath = await saveFileToAppStorage(tempPath, name);
            const fileId = await addFileToFolder(name, folderId, type, newPath);

            setUser((prevUser) => {
                const updatedFolders = { ...prevUser.folders };
                const folderEntry = Object.entries(updatedFolders).find(([key, value]) => value.id === folderId);

                if (folderEntry) {
                    const [folderName, folderData] = folderEntry;
                    updatedFolders[folderName] = {
                        ...folderData,
                        filesCount: folderData.filesCount + 1,
                        files: [...folderData.files, { id: fileId, name, type, path: newPath }],
                    };
                }

                return { ...prevUser, folders: updatedFolders };
            });
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן להוסיף את הקובץ כעת");
        }
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            userStatus,
            setUserStatus,
            createUser,
            updateUserName,
            loadUser,
            createNewFolder,
            addNewFile,
            markAsFavorite
        }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
