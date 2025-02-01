import * as SQLite from 'expo-sqlite';

const initDB = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('myapp.db');
        await db.execAsync('PRAGMA foreign_keys = ON;');
        return db;
    } catch (error) {
        console.error('Database initialization error:', error);
        return null;
    }
};


const getElement = async (element) => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`SELECT * FROM ${element}`);
        return result;
    } catch (error) {
        console.error(`Error fetching data from table: ${element}`, error);
        return [];
    }
};

export const printDB = async () => {
    const user = await getElement("user");
    const folders = await getElement("folders");
    const files = await getElement("files");

    console.log("User Table:", user);
    console.log("Folders Table:", folders);
    console.log("Files Table:", files);
}
// FOR DEVELOPMENT!! DELETE IT IN PRODUCTION!! 
const deleteElement = async (tableName, elementid) => {
    try {
        const db = await initDB();

        await db.runAsync(`DELETE FROM ${tableName} WHERE id = ?`, [elementid]);

        console.log(`Element with ID ${elementid} deleted successfully.`);
        return true;
    } catch (error) {
        console.error('Error deleting element:', error);
        return false;
    }
};

// FOR DEVELOPMENT!! DELETE IT IN PRODUCTION!! 
export const deleteDB = async () => {
    try {
        const db = await initDB();

        await db.execAsync('DROP TABLE IF EXISTS user');

        await db.execAsync('DROP TABLE IF EXISTS files');

        await db.execAsync('DROP TABLE IF EXISTS folders');

        console.log("The DB deleted successfully!");
        return true;
    } catch (error) {
        console.error('Error deleting DB:', error);
        return false;
    }
};


export const isFirstTime = async () => {
    try {
        const db = await initDB();
        const result = await db.getAllAsync(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='user'
        `);
        return result.length === 0;
    } catch (error) {
        console.error('Error with isFirstTime function:', error);
        return true;
    }
};


export const createApplicationDB = async (id, name, email) => {
    try {
        if (!id || !name || !email) {
            throw new Error('id, Name and email are required');
        }

        const db = await initDB();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS user ( 
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL, 
                email TEXT NOT NULL   
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS folders ( 
                name TEXT PRIMARY KEY NOT NULL, 
                filesCount INTEGER NOT NULL
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS files ( 
                name TEXT PRIMARY KEY NOT NULL, 
                folderId TEXT NOT NULL,
                tagName TEXT NOT NULL,
                type TEXT NOT NULL,
                path TEXT NOT NULL,
                FOREIGN KEY (folderId) REFERENCES folders (name) ON DELETE CASCADE
            );
        `);

        await db.runAsync('INSERT INTO user (id ,name, email) VALUES (?, ?, ?)', [id, name, email]);

        console.log("The Application created successfully!");
        return true;
    } catch (error) {
        console.error('Error creating application DB:', error);
        return false;
    }
};


export const createFolder = async (folderName) => {
    try {
        if (!folderName) {
            throw new Error('The folderName parameter are required');
        }

        const db = await initDB();

        await db.runAsync('INSERT INTO folders (name , filesCount) VALUES (?, ?)', [folderName, 0]);

        console.log(`The ${folderName} folder created successfully.`);
        return true;
    } catch (error) {
        console.error('Error with create folder: ', error);
        return false;
    }

}

export const addFile = async (name, folderId, tagName, type, path) => {
    try {
        if (!name || !folderId || !tagName || !type || !path) {
            throw new Error('All parameters (name, folderId, tagName, type, path) are required');
        }

        const db = await initDB();

        await db.runAsync(
            'INSERT INTO files (name, folderId, tagName, type, path) VALUES (?, ?, ?, ?, ?)',
            [name, folderId, tagName, type, path]
        );

        console.log(`File '${name}' added successfully to folder '${folderId}'.`);
        return true;
    } catch (error) {
        console.error('Error adding file:', error);
        return false;
    }
};



