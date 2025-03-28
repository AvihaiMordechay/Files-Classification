import * as SQLite from 'expo-sqlite';

const USER = "user";
const FOLDERS = "folders";
const FILES = "files";

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

export const createDB = async (id, name, gender) => {
    try {
        if (!id || !name || !gender) {
            throw new Error('id, Name and gender are required');
        }
        const db = await initDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${USER}  ( 
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL, 
                gender TEXT NOT NULL,
                lastLogin TEXT NOT NULL
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
                isFavorite INTEGER NOT NULL DEFAULT 0, 
                lastViewed TEXT DEFAULT NULL,
                FOREIGN KEY (folderId) REFERENCES ${FOLDERS} (id) ON DELETE CASCADE,
                UNIQUE (folderId, name)
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

        const lastLogin = new Date().toISOString();
        await db.runAsync(`INSERT INTO ${USER} (id ,name, gender, lastLogin) VALUES (?, ?, ?, ?)`,
            [id, name, gender, lastLogin]);

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

export const getUserDetails = async () => {
    return (await getTable(USER))[0];
}

export const changeUserName = async (name, userId) => {
    await updateElement(USER, "name", name, "id", userId);
    console.log("The user name changed successfully.");
}

export const updateLastLogin = async () => {
    const lastLogin = new Date().toISOString();
    const userId = await getUserId();
    await updateElement(USER, "lastLogin", lastLogin, "id", userId);
    console.log("Login time successfully recorded.");
};

export const getLastLogin = async () => {
    try {
        const db = await initDB();
        const result = await db.getFirstAsync(`SELECT lastLogin FROM ${USER}`);
        return result.lastLogin;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserId = async () => {
    try {
        const db = await initDB();
        const result = await db.getFirstAsync(`SELECT id FROM ${USER}`);
        return result.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// FOLDERS:
export const createFolder = async (folderName) => {
    try {
        if (!folderName) {
            throw new Error('The folderName parameter are required');
        }
        const db = await initDB();
        await db.runAsync(`INSERT INTO ${FOLDERS} (name , filesCount) VALUES (?, ?)`, [folderName, 0]);
        const newFolder = await db.getFirstAsync(`SELECT last_insert_rowid() AS id`);

        console.log(`The folder '${folderName}' created successfully with ID: ${newFolder.id}.`);
        return newFolder.id;
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
        const newFile = await db.getFirstAsync(`SELECT last_insert_rowid() AS id`);
        console.log(`File '${name}' added successfully to folder '${folderId}'.`);
        return newFile.id;
    } catch (error) {
        console.error("Error with addFile in DB:", error);
        throw error;
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

export const updateLastViewed = async (fileId) => {
    const timestamp = new Date().toISOString();
    await updateElement(FILES, "lastViewed", timestamp, "id", fileId);
    console.log(`Updated lastViewed for file ${fileId}`);
};

export const markFileAsFavorite = async (value, fileId) => {
    await updateElement(FILES, "isFavorite", value, "id", fileId);
    console.log(`Updated isFavorite for file ${fileId}`);
};

export const deleteFileFromFolder = async (fileId) => {
    await deleteRow(FILES, fileId);
    console.log(`File: '${fileId}' removed successfully!`);
};

// OTHERS:
export const printDB = async () => {
    const user = await getTable(USER);
    const folders = await getTable(FOLDERS);
    const files = await getTable(FILES);

    console.log("User Table:", user);
    console.log("Folders Table:", folders);
    console.log("Files Table:", files);
}