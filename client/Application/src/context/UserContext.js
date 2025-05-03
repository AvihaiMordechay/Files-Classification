import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert, AppState } from "react-native";
import { auth } from "../services/firebase";
import AlertModal from "../components/modals/AlertModal";
import {
    deleteFile,
    fileExistsInStorage,
    saveFileToAppStorage,
} from "../services/localFileSystem";
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
    closeDB,
    addFileToFolder,
    isFileExistInDB,
    markFileAsFavorite,
    updateLastViewed,
    favorites,
    setFavorites,
} from "../services/database";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false); // for managing alert visibility
    const [alertMessage, setAlertMessage] = useState(""); // for holding the alert message
    const [alertTitle, setAlertTitle] = useState(""); // for holding the alert title

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                if (nextAppState === "background" || nextAppState === "inactive") {
                    closeDB().catch((err) =>
                        console.error("Error closing DB on app state change:", err)
                    );
                }
            }
        );

        return () => {
            appStateSubscription.remove();
            closeDB().catch((err) =>
                console.error("Error closing DB on component unmount:", err)
            );
        };
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (await isFirstTime()) {
                setUser(null);
                setUserStatus("new");
            } else if (firebaseUser !== null && (await isUserLoggedIn())) {
                try {
                    await loadUser();
                    setUserStatus("authenticated");
                } catch (error) {
                    setUserStatus("unauthenticated");
                }
            } else {
                setUser(null);
                setUserStatus("unauthenticated");
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
            const [folders, favorites] = await loadFoldersFromDB();
            setUser({
                id: userDetails.id,
                name: userDetails.name,
                gender: userDetails.gender,
                folders: folders,
                favorites: favorites,
                imgPath: null,
            });
        } catch (error) {
            console.error("Error loading user:", error);
            throw error;
        }
    };

    const createUser = async (id, name, gender) => {
        try {
            await createDB(id, name, gender);
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן להירשם כעת, אנא נסה שנית");
            setAlertVisible(true); 
            throw error;
        }
    };

    const loadFoldersFromDB = async () => {
        let foldersDetails = [];
        try {
            foldersDetails = await getFoldersDetails();
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן לגשת לנתוני המשתמש");
            setAlertVisible(true); 
            return [[], []];
        }

        const favoritesTmp = [];
        const folders = await Promise.all(
            foldersDetails.map(async (folder) => {
                let filesList = [];
                try {
                    filesList = await getFilesByFolder(folder.id);
                } catch (error) {
                    console.error("Error loading files for folder", folder.id, error);
                    filesList = [];
                }

                const filesMap = {};
                filesList.forEach((file) => {
                    filesMap[file.id] = file;

                    if (file.isFavorite) {
                        favoritesTmp.push({
                            fileId: file.id,
                            folderName: folder.name,
                        });
                    }
                });

                return {
                    [folder.name]: {
                        id: folder.id,
                        filesCount: folder.filesCount,
                        files: filesMap,
                    },
                };
            })
        );

        return [Object.assign({}, ...folders), favoritesTmp];
    };

    const updateUserName = async (newName) => {
        if (!user) return;
        try {
            await changeUserName(newName, user.id);
            setUser((prevUser) => ({ ...prevUser, name: newName }));
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן לעדכן את שם המשתמש");
            setAlertVisible(true); 
        }
    };

    const createNewFolder = async (newName, withAlert = true) => {
        if (!user) return;
        if (user.folders[newName]) {
            throw new Error("already exist");
        }
        try {
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
            if (withAlert) {
                setAlertTitle("הצלחה");
                setAlertMessage("התיקייה נוצרה בהצלחה");
                setAlertVisible(true); 
            }
            return folderId;
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן לפתוח תיקייה חדשה");
            setAlertVisible(true); 
            return false;
        }
    };

    const addNewFile = async (name, folderId, type, tempPath) => {
        if (!user) return;

        let newPath;
        let fileId;

        try {
            newPath = await saveFileToAppStorage(tempPath, name, folderId);
            try {
                fileId = await addFileToFolder(name, folderId, type, newPath);
            } catch (error) {
                await deleteFile(newPath);
                throw error;
            }
            setUser((prevUser) => {
                const updatedFolders = { ...prevUser.folders };
                const folderEntry = Object.entries(updatedFolders).find(
                    ([key, value]) => value.id === folderId
                );

                if (folderEntry) {
                    const [folderName, folderData] = folderEntry;
                    updatedFolders[folderName] = {
                        ...folderData,
                        filesCount: folderData.filesCount + 1,
                        files: {
                            ...folderData.files,
                            [fileId]: {
                                name: name,
                                id: fileId,
                                type: type,
                                path: newPath,
                                isFavorite: 0,
                                lastViewed: null,
                            },
                        },
                    };
                }

                return { ...prevUser, folders: updatedFolders };
            });
            setAlertTitle("הצלחה");
            setAlertMessage("הקובץ צורף לתיקייה בהצלחה");
            setAlertVisible(true); 
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן להוסיף את הקובץ כעת");
            setAlertVisible(true); 
        }
    };

    const isFileExist = async (folderId, fileName) => {
        try {
            return (
                (await fileExistsInStorage(folderId, fileName)) &&
                (await isFileExistInDB(folderId, fileName))
            );
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן להוסיף את הקובץ כעת");
            setAlertVisible(true); 
            throw error;
        }
    };

    const deleteAccount = async () => {
        try {
            Object.values(user.folders).forEach((folder) => {
                folder.files.forEach(async (file) => {
                    await deleteFile(file.path);
                });
            });
            await deleteDB();
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן למחוק את המשתמש כעת");
            setAlertVisible(true); 
        }
    };

    const markAsFavorite = async (value, fileId, folderName) => {
        try {
            await markFileAsFavorite(value, fileId);

            setUser((prevUser) => {
                const updatedFolders = { ...prevUser.folders };
                const updatedFavorites = [...(prevUser.favorites || [])];

                if (
                    folderName &&
                    updatedFolders[folderName] &&
                    updatedFolders[folderName].files[fileId]
                ) {
                    updatedFolders[folderName].files[fileId] = {
                        ...updatedFolders[folderName].files[fileId],
                        isFavorite: value ? 1 : 0,
                    };
                }

                if (value) {
                    const alreadyExists = updatedFavorites.some(
                        (fav) => fav.fileId === fileId && fav.folderName === folderName
                    );
                    if (!alreadyExists) {
                        updatedFavorites.push({ fileId, folderName });
                    }
                } else {
                    const newFavorites = updatedFavorites.filter(
                        (fav) => !(fav.fileId === fileId && fav.folderName === folderName)
                    );
                    return {
                        ...prevUser,
                        folders: updatedFolders,
                        favorites: newFavorites,
                    };
                }

                return {
                    ...prevUser,
                    folders: updatedFolders,
                    favorites: updatedFavorites,
                };
            });
        } catch (error) {
            setAlertTitle("שגיאה");
            setAlertMessage("לא ניתן לסמן את הקובץ כמועדף");
            setAlertVisible(true); 
            console.log(`error with set user as favorie ${error}`);
        }
    };

    const updateLastViewedToFile = async (id) => {
        try {
            await updateLastViewed(id);
        } catch (error) {
            console.log("falid to update last viewed to file id: ", id);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                userStatus,
                setUserStatus,
                createUser,
                updateUserName,
                loadUser,
                createNewFolder,
                addNewFile,
                isFileExist,
                markAsFavorite,
                deleteAccount,
                updateLastViewedToFile,
            }}
        >
            {!loading && children}
            <AlertModal
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle || "שגיאה"}
                message={alertMessage}
                buttons={[{ text: "סגור", onPress: () => setAlertVisible(false) }]}
            />
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
