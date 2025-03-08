import * as SQLite from 'expo-sqlite';

const USER = "user";
const FOLDERS = "folders";
const FILES = "files";
const FAVORITES = "favorites";

// --------------------- base functions -------------------------

const initDB = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('myapp.db');
        await db.execAsync('PRAGMA foreign_keys = ON;');
        return db;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createDB = async (id, name, email, gender) => {
    try {
        if (!id || !name || !email || !gender) {
            throw new Error('id, Name, gender and email are required');
        }

        const db = await initDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${USER}  ( 
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL, 
                email TEXT NOT NULL,
                gender TEXT NOT NULL
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FOLDERS} ( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE, 
                filesCount INTEGER NOT NULL
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FILES} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL, 
                folderId INTEGER NOT NULL,
                type TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                FOREIGN KEY (folderId) REFERENCES ${FOLDERS} (id) ON DELETE CASCADE,
                UNIQUE (folderId, name)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${FAVORITES} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fileId INTEGER NOT NULL UNIQUE,
                FOREIGN KEY (fileId) REFERENCES ${FILES} (id) ON DELETE CASCADE
            );
        `);

        await db.execAsync(`
            CREATE TRIGGER IF NOT EXISTS increment_files_count
            AFTER INSERT ON ${FILES}
            FOR EACH ROW
            BEGIN
                UPDATE ${FOLDERS} 
                SET filesCount = filesCount + 1 
                WHERE id = NEW.folderId;
            END;
        `);

        await db.execAsync(`
            CREATE TRIGGER IF NOT EXISTS decrement_files_count
            AFTER DELETE ON ${FILES}
            FOR EACH ROW
            BEGIN
                UPDATE ${FOLDERS} 
                SET filesCount = filesCount - 1 
                WHERE id = OLD.folderId;
            END;
        `);

        await db.runAsync(`INSERT INTO ${USER} (id ,name, email, gender) VALUES (?, ?, ?, ?)`, [id, name, email, gender]);

        console.log("The Application created successfully!");
    } catch (error) {
        console.error(error);
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
        throw error;
    }
};

const updateElement = async (tableName, column, columnValue, where, whereValue) => {
    try {
        const db = await initDB();
        await db.runAsync(
            `UPDATE ${tableName} SET ${column} = ? WHERE ${where} = ?`,
            [columnValue, whereValue]
        );
    } catch (error) {
        console.error(`Error changing data from table: ${tableName}`, error);
        throw error;
    }
}


const deleteRow = async (tableName, elementid) => {
    try {
        const db = await initDB();

        await db.runAsync(`DELETE FROM ${tableName} WHERE id = ?`, [elementid]);

        console.log(`Element with ID ${elementid} deleted successfully.`);
    } catch (error) {
        console.error(error);
        throw error;
    }
};



// --------------------------------------------------------------

// TEMP FUNCTION!!!!!!!!!!!!
export const deleteDB = async () => {
    try {
        const db = await initDB();
        await db.execAsync(`DROP TABLE IF EXISTS ${USER}`);
        await db.execAsync(`DROP TABLE IF EXISTS ${FILES}`);
        await db.execAsync(`DROP TABLE IF EXISTS ${FOLDERS}`);
        await db.execAsync(`DROP TABLE IF EXISTS ${FAVORITES}`);
        console.log("The DB deleted successfully!");
    } catch (error) {
        console.error(error);
        throw error;
    }
};
// USER:
export const isFirstTime = async () => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='${USER}'
        `);
        return result.length === 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserEmail = async () => {
    try {
        const db = await initDB();
        const result = await db.getFirstAsync(`SELECT email FROM ${USER}`);
        return result.email;
    } catch (error) {
        console.error("Error with get email:", error);
        throw error;
    }
}
export const getUserDetails = async () => {
    return (await getTable(USER))[0];
}

export const changeUserName = async (name, userId) => {
    updateElement(USER, "name", name, "id", userId);
    console.log("The user name changed successfully.");
}

// FOLDERS:
export const createFolder = async (folderName) => {
    try {
        if (!folderName) {
            throw new Error('The folderName parameter are required');
        }
        const db = await initDB();
        await db.runAsync(`INSERT INTO ${FOLDERS} (name , filesCount) VALUES (?, ?)`, [folderName, 0]);
        console.log(`The ${folderName} folder created successfully.`);
    } catch (error) {
        console.error("Error with createFolder in DB:", error);
        throw error;
    }
}

export const getFoldersDetails = async () => {
    return getTable(FOLDERS);
}

export const changeFolderName = async (newName, id) => {
    await updateElement(FOLDERS, "name", newName, "id", id);
    console.log(`Folder name updated to ${newName} on id: ${id}.`);
}

export const deleteFolder = async (folderId) => {
    // TODO: Delete the files that contains in folder? Or send a meassage that impossibole to delete the folder!
    await deleteRow(FOLDERS, folderId);
    console.log(`Folder: '${folderId}' removed successfully!`);
}

// FILES:
export const addFileToFolder = async (name, folderId, type, path) => {
    try {
        if (!name || !folderId || !type || !path) {
            throw new Error('All parameters (name, folderId, type, path) are required');
        }

        const db = await initDB();

        await db.runAsync(
            `INSERT INTO ${FILES} (name, folderId, type, path) VALUES (?, ?, ?, ?)`,
            [name, folderId, type, path]
        );

        console.log(`File '${name}' added successfully to folder '${folderId}'.`);
        return true;
    } catch (error) {
        console.error("Error with addFile in DB:", error);
        return error; // To handle errors differently in the GUI
    }
};

export const getFilesByFolder = async (folderId) => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT ${FILES}.id, ${FILES}.name, ${FILES}.type, ${FILES}.path
            FROM ${FILES}
            JOIN ${FOLDERS} ON ${FILES}.folderId = ${FOLDERS}.id
            WHERE ${FOLDERS}.id = ?
        `, [folderId]);
        return result;
    } catch (error) {
        console.error('Error fetching files by category:', error);
        throw error;
    }
};

export const changeFileName = async (newName, id) => {
    await updateElement(FILES, "name", newName, "id", id);
    console.log(`File name updated to '${newName} on id: ${id}.`);
}

export const deleteFileFromFolder = async (fileId) => {
    await deleteRow(FILES, fileId);
    console.log(`File: '${fileId}' removed successfully!`);
};

// FAVORITES:
export const addFileToFavorites = async (fileId) => {
    try {
        const db = await initDB();

        await db.runAsync(
            `INSERT INTO ${FAVORITES} (fileId) VALUES (?)`,
            [fileId]
        );
        console.log(`File '${fileId}' added to ${FAVORITES}.`);
    } catch (error) {
        console.error("Error with addFileToFavorites in DB:", error);
        throw error;
    }
};

export const getAllFavoritesFiles = async () => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT 
                ${FAVORITES}.*,
                ${FILES}.name, 
                ${FILES}.path, 
                ${FILES}.type, 
                ${FILES}.folderId,  
                ${FOLDERS}.name AS folderName
            FROM ${FAVORITES}
            JOIN ${FILES} ON ${FAVORITES}.fileId = ${FILES}.id
            JOIN ${FOLDERS} ON ${FILES}.folderId = ${FOLDERS}.id
            ORDER BY ${FAVORITES}.id DESC
        `);
        return result;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

export const deleteFavoriteFile = async (favoriteFileId) => {
    await deleteRow(FAVORITES, favoriteFileId);
    console.log(`File: '${favoriteFileId}' removed successfully!`);
}

// OTHERS:
export const printDB = async () => {
    const user = await getTable(USER);
    const folders = await getTable(FOLDERS);
    const files = await getTable(FILES);
    const favorite = await getTable(FAVORITES);

    console.log("User Table:", user);
    console.log("Folders Table:", folders);
    console.log("Files Table:", files);
    console.log("Favorites Table:", favorite);
}