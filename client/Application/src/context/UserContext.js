import React, { createContext, useContext, useState, useEffect } from 'react';
import User from '../user/user';
import { auth } from '../services/firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(new User());
    const [userStatus, setUserStatus] = useState(null); // 'new', 'authenticated', 'unauthenticated'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initApplication();
    }, []);

    const isAuthenticated = async () => {
        return false;
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
                unsubscribe();
                if (firebaseUser) {
                    await user.initDB();
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

    const initApplication = async () => {
        try {
            if (await isAuthenticated()) {
                setUserStatus('authenticated');
            } else {
                setUserStatus('unauthenticated');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, userStatus, setUserStatus }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
