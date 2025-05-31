import { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { auth } from '../services/firebase';
import AlertModal from '../components/modals/AlertModal';
import uuid from 'react-native-uuid';
import {
  deleteAllAppDataFromLocalStorage,
  deleteFileFromLocalStorage,
  deleteFolderFromLocalStorage,
  saveFileToAppStorage,
} from '../services/localFileSystem';
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
  updateFileName,
  deleteFileFromFolder,
  resetDatabaseState,
  updateFolderName,
  deleteFolderDB,
  getScaleFactor,
  printDB,
} from "../services/database";
import { useFontScale } from './AccessibilityContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { setScaleFactor, scaleFactor } = useFontScale();
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          closeDB().catch((err) =>
            console.log('Error closing DB on app state change:', err)
          );
        }
      }
    );

    return () => {
      appStateSubscription.remove();
      closeDB().catch((err) =>
        console.log('Error closing DB on component unmount:', err)
      );
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      await resetDatabaseState();
      if (await isFirstTime()) {
        setUser(null);
        setUserStatus('new');
      } else if (firebaseUser !== null && (await isUserLoggedIn())) {
        const scale = await getScaleFactor();
        setScaleFactor(scale);
        try {
          await loadUser();
          setUserStatus('authenticated');
        } catch (error) {
          setUserStatus('unauthenticated');
        }
      } else {
        const scale = await getScaleFactor();
        setScaleFactor(scale);
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
      console.log('Error loading user:', error);
      throw error;
    }
  };

  const createUser = async (id, name, gender) => {
    try {
      await createDB(id, name, gender);
    } catch (error) {
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן להירשם כעת, אנא נסה שנית');
      setAlertVisible(true);
      throw error;
    }
  };

  const loadFoldersFromDB = async () => {
    let foldersDetails = [];
    try {
      foldersDetails = await getFoldersDetails();
    } catch (error) {
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן לגשת לנתוני המשתמש');
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
          console.log('Error loading files for folder', folder.id, error);
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
      if (newName.length === 0) {
        setAlertTitle('שגיאה');
        setAlertMessage('לא ניתן לשמור שם משתמש ריק');
        setAlertVisible(true);
        return;
      }
      await changeUserName(newName, user.id);
      setUser((prevUser) => ({ ...prevUser, name: newName }));
    } catch (error) {
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן לעדכן את שם המשתמש');
      setAlertVisible(true);
    }
  };

  const createNewFolder = async (newName, withAlert = true) => {
    if (!user) return;
    if (user.folders[newName]) {
      throw new Error('already exist');
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
            files: {},
          },
        },
      }));
      if (withAlert) {
        setAlertTitle('הצלחה');
        setAlertMessage('התיקייה נוצרה בהצלחה');
        setAlertVisible(true);
      }
      return folderId;
    } catch (error) {
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן לפתוח תיקייה חדשה');
      setAlertVisible(true);
      return false;
    }
  };

  const addNewFile = async (name, folderId, type, size, createDate, tempPath) => {
    if (!user) return;

    let fileId;
    let newPath;
    try {
      newPath = await saveFileToAppStorage(tempPath, uuid.v4(), folderId);
      try {
        fileId = await addFileToFolder(name, folderId, type, newPath, size, createDate);
      } catch (error) {
        await deleteFileFromLocalStorage(newPath);
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
                id: fileId,
                name: name,
                type: type,
                path: newPath,
                size: size,
                createDate: createDate,
                isFavorite: 0,
                lastViewed: null,
              },
            },
          };
        }

        return { ...prevUser, folders: updatedFolders };
      });

      setAlertTitle('הצלחה');
      setAlertMessage('הקובץ צורף לתיקייה בהצלחה');
      setAlertVisible(true);
    } catch (error) {
      if (newPath) await deleteFileFromLocalStorage(newPath);
      if (fileId) await deleteFileFromFolder(fileId);

      console.log("error with addNewFile: ", error);

      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן להוסיף את הקובץ כעת');
      setAlertVisible(true);
    }
  };

  const isFileExist = async (folderId, fileName) => {
    try {
      return await isFileExistInDB(folderId, fileName);
    } catch (error) {
      console.log("error with isFileExist: ", error);
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן להוסיף את הקובץ כעת');
      setAlertVisible(true);
      throw error;
    }
  };

  const changeFolderName = async (oldName, newName) => {
    if (!user) return;

    if (user.folders[newName]) {
      throw new Error("alreadyExists");
    }

    try {
      const folderId = user.folders[oldName]?.id;
      if (!folderId) {
        throw new Error("folder not found");
      }
      await updateFolderName(newName, folderId);
      setUser((prevUser) => {
        const updatedFolders = { ...prevUser.folders };

        updatedFolders[newName] = {
          ...updatedFolders[oldName]
        };

        delete updatedFolders[oldName];

        const updatedFavorites = prevUser.favorites.map((fav) => {
          if (fav.folderName === oldName) {
            return { ...fav, folderName: newName };
          }
          return fav;
        });

        return {
          ...prevUser,
          folders: updatedFolders,
          favorites: updatedFavorites
        };
      });
    } catch (error) {
      console.log("Error changing folder name:", error);
      throw error;
    }
  };

  const changeFileName = async (newName, fileId, folderName) => {
    if (!user) return;

    const currentFile = user.folders[folderName]?.files[fileId];
    if (!currentFile) {
      throw new Error("fileNotFound");
    }

    if (currentFile.name === newName) {
      throw new Error("sameName");
    }

    // Check if another file with the same name exists in the folder
    const fileExists = Object.values(user.folders[folderName].files).some(
      file => file.id !== fileId && file.name === newName
    );

    if (fileExists) {
      throw new Error("alreadyExists");
    }

    try {
      await updateFileName(newName, fileId);

      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        const updatedFolders = { ...prevUser.folders };

        if (
          updatedFolders[folderName] &&
          updatedFolders[folderName].files[fileId]
        ) {
          updatedFolders[folderName].files[fileId] = {
            ...updatedFolders[folderName].files[fileId],
            name: newName,
          };
        }

        const updatedFavorites = prevUser.favorites.map((fav) => {
          if (fav.fileId === fileId && fav.folderName === folderName) {
            return { ...fav, name: newName };
          }
          return fav;
        });

        return {
          ...prevUser,
          folders: updatedFolders,
          favorites: updatedFavorites,
        };
      });
    } catch (error) {
      console.log('error with changeFileName:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (user && user.folders) {
        await deleteAllAppDataFromLocalStorage();
      }

      await resetDatabaseState();
      await deleteDB();

      setUser(null);
      setUserStatus('unauthenticated');
    } catch (error) {
      console.log('Error in deleteAccount:', error);
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן למחוק את המשתמש כעת');
      setAlertVisible(true);
      throw error;
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
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן לסמן את הקובץ כמועדף');
      setAlertVisible(true);
      console.log(`error with set user as favorite ${error}`);
    }
  };

  const updateLastViewedToFile = async (id) => {
    try {
      await updateLastViewed(id);
    } catch (error) {
      console.log('failed to update last viewed to file id: ', id);
    }
  };

  const deleteFile = async (folderName, fileId) => {
    try {
      const filePath = user.folders[folderName]?.files[fileId]?.path;
      if (filePath) {
        await deleteFileFromLocalStorage(filePath);
      }
      await deleteFileFromFolder(fileId);

      setUser((prevUser) => {
        const updatedFolders = { ...prevUser.folders };
        const updatedFavorites = (prevUser.favorites || []).filter(
          (fav) => !(fav.fileId === fileId && fav.folderName === folderName)
        );

        if (
          updatedFolders[folderName] &&
          updatedFolders[folderName].files[fileId]
        ) {
          const { [fileId]: _, ...remainingFiles } =
            updatedFolders[folderName].files;
          updatedFolders[folderName] = {
            ...updatedFolders[folderName],
            filesCount: Math.max(updatedFolders[folderName].filesCount - 1, 0),
            files: remainingFiles,
          };
        }

        return {
          ...prevUser,
          folders: updatedFolders,
          favorites: updatedFavorites,
        };
      });

      setAlertTitle('הצלחה');
      setAlertMessage('הקובץ נמחק בהצלחה');
      setAlertVisible(true);
    } catch (error) {
      console.log('Failed to deleteFile:', error);
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן למחוק את הקובץ כעת');
      setAlertVisible(true);
    }
  };

  const deleteFolder = async (folderName) => {
    if (!user) return;

    try {
      const folderId = user.folders[folderName].id;

      await deleteFolderFromLocalStorage(folderId);
      await deleteFolderDB(folderId);

      setUser((prevUser) => {
        const updatedFolders = { ...prevUser.folders };
        delete updatedFolders[folderName];

        const updatedFavorites = prevUser.favorites.filter(
          (fav) => fav.folderName !== folderName
        );

        return {
          ...prevUser,
          folders: updatedFolders,
          favorites: updatedFavorites,
        };
      });

      setAlertTitle('הצלחה');
      setAlertMessage('התיקייה נמחקה בהצלחה');
      setAlertVisible(true);
    } catch (error) {
      console.log("error with deleteFolder: ", error);
      setAlertTitle('שגיאה');
      setAlertMessage('לא ניתן למחוק את התיקייה כעת');
      setAlertVisible(true);
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
      isFileExist,
      markAsFavorite,
      deleteAccount,
      updateLastViewedToFile,
      changeFileName,
      changeFolderName,
      deleteFile,
      deleteFolder
    }}>
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