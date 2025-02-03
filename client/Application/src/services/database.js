import * as SQLite from 'expo-sqlite';

const USER = "user";
const FOLDERS = "folders";
const FILES = "files";
const FAVORITES = "favorites";

const initDB = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('myapp.db');
        await db.execAsync('PRAGMA foreign_keys = ON;');
        return db;
    } catch (error) {
        console.error('Database initialization error:');
        throw error;
    }
};


const getTable = async (tableName) => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
        return result;
    } catch (error) {
        console.error(`Error fetching data from table: ${tableName}`, error);
        return [];
    }
};


export const printDB = async () => {
    const user = await getTable(`${USER}`);
    const folders = await getTable(`${FOLDERS}`);
    const files = await getTable(`${FILES}`);
    const favorite = await getTable(`${FAVORITES}`);

    console.log("User Table:", user);
    console.log("Folders Table:", folders);
    console.log("Files Table:", files);
    console.log("Favorites Table:", favorite);
}

const deleteRow = async (tableName, elementid) => {
    try {
        const db = await initDB();

        await db.runAsync(`DELETE FROM ${tableName} WHERE id = ?`, [elementid]);

        console.log(`Element with ID ${elementid} deleted successfully.`);
        return true;
    } catch (error) {
        console.error('Error deleting element:');
        throw error;
    }
};

export const deleteDB = async () => {
    try {
        const db = await initDB();

        await db.execAsync(`DROP TABLE IF EXISTS ${USER}`);

        await db.execAsync(`DROP TABLE IF EXISTS ${FILES}`);

        await db.execAsync(`DROP TABLE IF EXISTS ${FOLDERS}`);

        await db.execAsync(`DROP TABLE IF EXISTS ${FAVORITES}`);

        console.log("The DB deleted successfully!");
        return true;
    } catch (error) {
        throw error;
    }
};


export const isFirstTime = async () => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='${USER}'
        `);
        return result.length === 0;
    } catch (error) {
        throw error;
    }
};


export const createDB = async (id, name, email) => {
    try {
        if (!id || !name || !email) {
            throw new Error('id, Name and email are required');
        }

        const db = await initDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${USER}  ( 
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL, 
                email TEXT NOT NULL   
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FOLDERS} ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL, 
                filesCount INTEGER NOT NULL
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FILES} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL, 
                folderId INTEGER NOT NULL,
                tagName TEXT NOT NULL,
                type TEXT NOT NULL,
                path TEXT NOT NULL,
                FOREIGN KEY (folderId) REFERENCES ${FOLDERS} (id) ON DELETE CASCADE
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FAVORITES} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fileId INTEGER NOT NULL UNIQUE,
                FOREIGN KEY (fileId) REFERENCES ${FILES} (id) ON DELETE CASCADE
            );
        `);

        await db.runAsync(`INSERT INTO ${USER} (id ,name, email) VALUES (?, ?, ?)`, [id, name, email]);

        console.log("The Application created successfully!");
        return true;
    } catch (error) {
        throw error;
    }
};


export const createFolder = async (folderName) => {
    try {
        if (!folderName) {
            throw new Error('The folderName parameter are required');
        }

        const db = await initDB();

        await db.runAsync(`INSERT INTO ${FOLDERS} (name , filesCount) VALUES (?, ?)`, [folderName, 0]);

        console.log(`The ${folderName} folder created successfully.`);
        return true;
    } catch (error) {
        console.log("Error with createFolder in DB:", error);
        return error; // To handle errors differently in the GUI
    }

}

export const addFile = async (name, folderId, tagName, type, path) => {
    try {
        if (!name || !folderId || !tagName || !type || !path) {
            throw new Error('All parameters (name, folderId, tagName, type, path) are required');
        }

        const db = await initDB();

        await db.runAsync(
            `INSERT INTO ${FILES} (name, folderId, tagName, type, path) VALUES (?, ?, ?, ?, ?)`,
            [name, folderId, tagName, type, path]
        );

        console.log(`File '${name}' added successfully to folder '${folderId}'.`);
        return true;
    } catch (error) {
        console.log("Error with addFile in DB:", error);
        return error; // To handle errors differently in the GUI
    }
};

export const addFileToFavorites = async (fileId) => {
    try {
        const db = await initDB();

        await db.runAsync(
            `INSERT INTO ${FAVORITES} (fileId) VALUES (?)`,
            [fileId]
        );

        console.log(`File '${fileId}' added to ${FAVORITES}.`);
        return true;
    } catch (error) {
        console.log("Error with addFileToFavorites in DB:", error);
        return error; // To handle errors differently in the GUI
    }
};

export const getAllFavoritesFiles = async () => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT 
                ${FAVORITES}.id as favoriteId,
                ${FILES}.*
            FROM ${FAVORITES}
            JOIN ${FILES} ON ${FAVORITES}.fileId = ${FILES}.name
            ORDER BY ${FAVORITES}.id DESC
        `);

        return result;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

export const getFavoriteFileById = async (favoriteId) => {
    try {
        const db = await initDB();
        const result = await db.getFirstAsync(`
            SELECT 
                ${FAVORITES}.id as favoriteId,
                ${FILES}.*
            FROM ${FAVORITES}
            JOIN ${FILES} ON ${FAVORITES}.fileId = ${FILES}.name
            WHERE ${FAVORITES}.id = ?
        `, [favoriteId]);

        return result;
    } catch (error) {
        console.error('Error fetching favorite by ID:', error);
        return null;
    }
};

export const getAllCategories = async () => {
    try {
        const result = getTable(`${FOLDERS}`);
        return result;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export const deleteFileDB = async (fileId) => {
    try {
        const result = deleteRow(`${FILES}`, fileId);
        console.log(`File:'${fileId}' removed successfully!`);
        return true;
    } catch (error) {
        console.error('Error with delete file:', error);
        return false;
    }
}

export const deleteFolderDB = async (folderId) => {
    try {
        const result = deleteRow(`${FOLDERS}`, folderId);
        console.log(`Folder: '${folderId}' removed successfully!`);
        return true;
    } catch (error) {
        console.error('Error with delete folder:', error);
        return false;
    }
}

export const changeFileNameDB = async (oldName, newName) => {
    try {
        if (!oldName || !newName) {
            throw new Error('Both oldName and newName are required');
        }

        const db = await initDB();

        await db.runAsync(`
            UPDATE ${FILES} 
            SET name = ? 
            WHERE name = ?
        `, [newName, oldName]);

        console.log(`File name updated from '${oldName}' to '${newName}'.`);
        return true;
    } catch (error) {
        console.error('Error updating file name:', error);
        return false;
    }
}

export const changeFolderNameDB = async (oldName, newName) => {
    try {
        if (!oldName || !newName) {
            throw new Error('Both oldName and newName are required');
        }

        const db = await initDB();

        await db.runAsync(`
            UPDATE ${FOLDERS} 
            SET name = ? 
            WHERE name = ?
        `, [newName, oldName]);

        console.log(`Folder name updated from '${oldName}' to '${newName}'.`);
        return true;
    } catch (error) {
        console.error('Error updating folder name:', error);
        return false;
    }
}

