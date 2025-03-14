import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import {
    getUserDetails,
    getAllFavoritesFiles,
    changeUserName,
    isFirstTime,
    getFoldersDetails,
    getFilesByFolder,
    createDB,
    getLastLogin,
    deleteDB,
    createFolder,
    addFileToFolder,
    changeUserEmail
} from '../services/database';
import { Alert } from 'react-native';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [loading, setLoading] = useState(true);

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
            console.error("Error checking last login:", error);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (await isFirstTime()) {
                setUser(null);
                setUserStatus('new');
            } else if (await isUserLoggedIn() && (firebaseUser !== null)) {
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

    const loadUser = async () => {
        try {
            debugger;
            const userDetails = await getUserDetails();
            const favorites = await getAllFavoritesFiles();
            const folders = await loadFoldersFromDB();
            setUser({
                id: userDetails.id,
                name: userDetails.name,
                gender: userDetails.gender,
                email: userDetails.email,
                folders: folders,
                imgPath: null,
                favoritesFiles: favorites,
            });
        } catch (error) {
            console.error("Error loading user:", error);
            throw error;
        }
    }

    const createUser = async (id, name, gender, email) => {
        try {
            await createDB(id, name, gender, email);
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

    const updateUserEmail = async (newEmail) => {
        if (!user) return;
        try {
            await changeUserEmail(newEmail, user.id);
            setUser((prevUser) => ({ ...prevUser, email: newEmail }));
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן לעדכן את שם המשתמש");
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, userStatus, createUser, updateUserName, updateUserEmail, loadUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
