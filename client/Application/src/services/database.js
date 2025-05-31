import * as SQLite from 'expo-sqlite';
import { AccessibilityInfo } from 'react-native';

const ACCESSIBILITY = 'accessibility';
const USER = 'user';
const FOLDERS = 'folders';
const FILES = 'files';
const DB_NAME = 'myapp.db';

// Singleton Database instance
let dbInstance = null;

// Initialize database once
export const initDB = async () => {
  try {
    if (dbInstance && !dbInstance._closed) {
      return dbInstance;
    }

    console.log('Starting database initialization');
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    try {
      await db.execAsync('PRAGMA foreign_keys = ON;');
    } catch (pragmaError) {
      console.log('Error setting PRAGMA:', pragmaError);
    }

    dbInstance = db;
    console.log('Database initialized successfully');
    return dbInstance;
  } catch (error) {
    console.log('Database initialization error:', error);
    dbInstance = null;
    throw error;
  }
};

export const resetDatabaseState = async () => {
  try {
    await closeDB();

    dbInstance = null;

    console.log('Database state reset successfully');
  } catch (error) {
    console.log('Error resetting database state:', error);
    dbInstance = null;
  }
};

const safeDBOperation = async (operation) => {
  try {
    await initDB();

    return await operation();
  } catch (error) {
    await resetDatabaseState();
    await initDB();
    return await operation();
  }
};

// Close database connection when app is closing
export const closeDB = async () => {
  try {
    if (dbInstance) {
      if (dbInstance._closed) {
        console.log('Database already closed');
        return;
      }

      try {
        await dbInstance.closeAsync();
        dbInstance = null;
        console.log('Database connection closed');
      } catch (closeError) {
        console.log('Error during database close:', closeError);

        dbInstance = null;
      }
    }
  } catch (error) {
    console.log('Unexpected error closing database:', error);
    dbInstance = null;
  }
};

export const createDB = async (id, name, gender) => {
  return safeDBOperation(async () => {
    try {
      if (!id || !name || !gender) {
        throw new Error('id, Name and gender are required');
      }
      const db = await initDB();

      await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${ACCESSIBILITY}  ( 
                scaleFactor INTEGER NOT NULL DEFAULT 0
            );
        `);

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
                path TEXT NOT NULL,
                isFavorite INTEGER NOT NULL DEFAULT 0, 
                lastViewed TEXT DEFAULT NULL,
                size TEXT  NOT NULL,
                createDate TEXT  NOT NULL,
                FOREIGN KEY (folderId) REFERENCES ${FOLDERS} (id) ON DELETE CASCADE,
                UNIQUE (folderId, name)
            );
        `);

      // Create triggers
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

      await db.runAsync(
        `INSERT INTO ${ACCESSIBILITY} (scaleFactor) VALUES (?)`,
        [0]
      );

      // Check if user exists first
      const userExists = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${USER} WHERE id = ?`,
        [id]
      );

      if (userExists && userExists.count > 0) {
        // Update existing user's login time
        const lastLogin = new Date().toISOString();
        await db.runAsync(`UPDATE ${USER} SET lastLogin = ? WHERE id = ?`, [
          lastLogin,
          id,
        ]);
      } else {
        // Insert new user
        const lastLogin = new Date().toISOString();
        await db.runAsync(
          `INSERT INTO ${USER} (id, name, gender, lastLogin) VALUES (?, ?, ?, ?)`,
          [id, name, gender, lastLogin]
        );
      }

      console.log('Application initialized successfully!');
      return true;
    } catch (error) {
      console.log('Error setting up database:', error);
      throw error;
    }
  });
};

// Generic table query function with error handling
const getTable = async (tableName) => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
      return result;
    } catch (error) {
      console.log(`Error fetching data from table: ${tableName}`, error);
      throw error;
    }
  });
};

// Generic update function with improved error handling
const updateElement = async (
  tableName,
  column,
  columnValue,
  where,
  whereValue
) => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.runAsync(
        `UPDATE ${tableName} SET ${column} = ? WHERE ${where} = ?`,
        [columnValue, whereValue]
      );

      if (result.rowsAffected === 0) {
        console.warn(
          `No rows updated in ${tableName} where ${where} = ${whereValue}`
        );
      }

      return result.rowsAffected;
    } catch (error) {
      console.log(`Error updating data in table: ${tableName}`, error);
      throw error;
    }
  });
};

// Generic delete function with validation
const deleteRow = async (tableName, elementId) => {
  return safeDBOperation(async () => {
    try {
      if (!elementId) {
        throw new Error(`ID is required to delete from ${tableName}`);
      }

      const db = await initDB();
      const result = await db.runAsync(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [elementId]
      );

      if (result.rowsAffected === 0) {
        console.warn(`No rows deleted from ${tableName} with ID ${elementId}`);
      }

      return result.rowsAffected;
    } catch (error) {
      console.log(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  });
};

// Delete database - consider removing in production
export const deleteDB = async () => {
  return safeDBOperation(async () => {
    try {
      if (dbInstance) {
        try {
          await closeDB();
        } catch (closeError) {
          console.log('Error closing DB before deletion:', closeError);
        }
      }

      await SQLite.deleteDatabaseAsync(DB_NAME);

      dbInstance = null;

      console.log('Database deleted successfully!');
    } catch (error) {
      console.log('Error deleting database:', error);
      dbInstance = null;
      throw error;
    }
  });
};

// USER FUNCTIONS
export const isFirstTime = async () => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.getAllAsync(
        `
            SELECT name FROM sqlite_master WHERE type='table' AND name IN (?, ?, ?)
        `,
        [USER, FOLDERS, FILES]
      );

      return result.length === 0;
    } catch (error) {
      console.log('Error checking first time:', error);
      throw error;
    }
  });
};

export const getUserDetails = async () => {
  return safeDBOperation(async () => {
    try {
      const users = await getTable(USER);
      if (users && users.length > 0) {
        return users[0];
      }
      return null;
    } catch (error) {
      console.log('Error getting user details:', error);
      throw error;
    }
  });
};

export const changeUserName = async (name, userId) => {
  return safeDBOperation(async () => {
    if (!name || !userId) {
      throw new Error('Name and userId are required');
    }

    const rowsUpdated = await updateElement(USER, 'name', name, 'id', userId);
    if (rowsUpdated > 0) {
      console.log('User name changed successfully.');
    }
    return rowsUpdated > 0;
  });
};

export const getScaleFactor = async () => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.getFirstAsync(`SELECT scaleFactor FROM ${ACCESSIBILITY}`);
      return result.scaleFactor;
    } catch (error) {
      console.log('Error getting user ID:', error);
      throw error;
    }
  });
}

export const changeScaleFactor = async (scaleFactor) => {
  return safeDBOperation(async () => {
    const db = await initDB();

    const result = await db.runAsync(
      `UPDATE ${ACCESSIBILITY} SET scaleFactor = ?`,
      [scaleFactor]
    );

    return result > 0;
  });
};

export const updateLastLogin = async () => {
  return safeDBOperation(async () => {
    try {
      const lastLogin = new Date().toISOString();
      const userId = await getUserId();

      if (!userId) {
        throw new Error('No user found');
      }

      await updateElement(USER, 'lastLogin', lastLogin, 'id', userId);
      console.log('Login time successfully recorded.');
      return true;
    } catch (error) {
      console.log('Error updating login time:', error);
      throw error;
    }
  });
};

export const getLastLogin = async () => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.getFirstAsync(`SELECT lastLogin FROM ${USER}`);
      return result ? result.lastLogin : null;
    } catch (error) {
      console.log('Error getting last login:', error);
      throw error;
    }
  });
};

export const getUserId = async () => {
  return safeDBOperation(async () => {
    try {
      const db = await initDB();
      const result = await db.getFirstAsync(`SELECT id FROM ${USER}`);
      return result ? result.id : null;
    } catch (error) {
      console.log('Error getting user ID:', error);
      throw error;
    }
  });
};

// FOLDERS FUNCTIONS
export const createFolder = async (folderName) => {
  return safeDBOperation(async () => {
    try {
      if (!folderName) {
        throw new Error('Folder name is required');
      }

      const db = await initDB();

      const result = await db.runAsync(
        `INSERT INTO ${FOLDERS} (name, filesCount) VALUES (?, ?)`,
        [folderName, 0]
      );

      if (result && result.insertId) {
        console.log(
          `Folder '${folderName}' created with ID: ${result.insertId}`
        );
        return result.insertId;
      } else {
        // For expo-sqlite compatibility
        const newFolder = await db.getFirstAsync(
          `SELECT last_insert_rowid() AS id`
        );
        console.log(`Folder '${folderName}' created with ID: ${newFolder.id}`);
        return newFolder.id;
      }
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        console.log(`Folder '${folderName}' already exists`);
        throw new Error(`Folder '${folderName}' already exists`);
      }
      console.log('Error creating folder:', error);
      throw error;
    }
  });
};

export const getFoldersDetails = async () => {
  return safeDBOperation(async () => {
    return getTable(FOLDERS);
  });
};

export const updateFolderName = async (newName, id) => {
  return safeDBOperation(async () => {

    if (!newName || !id) {
      throw new Error('New name and folder ID are required');
    }

    try {
      const rowsUpdated = await updateElement(
        FOLDERS,
        'name',
        newName,
        'id',
        id
      );
      if (rowsUpdated > 0) {
        console.log(`Folder name updated to ${newName} for ID: ${id}`);
      }
      return rowsUpdated > 0;
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        console.log(`Folder name '${newName}' already exists`);
        throw new Error(`Folder name '${newName}' already exists`);
      }
      throw error;
    }
  });
};

export const deleteFolderDB = async (folderId) => {
  return safeDBOperation(async () => {
    if (!folderId) {
      throw new Error('Folder ID is required');
    }

    const rowsDeleted = await deleteRow(FOLDERS, folderId);
    if (rowsDeleted > 0) {
      console.log(`Folder ID ${folderId} deleted successfully`);
    }
    return rowsDeleted > 0;
  });
};

// FILES FUNCTIONS
export const addFileToFolder = async (name, folderId, type, path, size, createDate) => {
  return safeDBOperation(async () => {
    try {
      if (!name || !folderId || !type || !path || !size || !createDate) {
        throw new Error(
          'All parameters (name, folderId, type, path, size, createDate) are required'
        );
      }

      const db = await initDB();

      // Check if folder exists
      const folderExists = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${FOLDERS} WHERE id = ?`,
        [folderId]
      );

      if (!folderExists || folderExists.count === 0) {
        throw new Error(`Folder with ID ${folderId} does not exist`);
      }

      const result = await db.runAsync(
        `INSERT INTO ${FILES} (name, folderId, type, path, size, createDate) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, folderId, type, path, size, createDate]
      );

      if (result && result.insertId) {
        console.log(
          `File '${name}' added to folder with ID: ${result.insertId}`
        );
        return result.insertId;
      } else {
        const newFile = await db.getFirstAsync(
          `SELECT last_insert_rowid() AS id`
        );
        console.log(`File '${name}' added to folder with ID: ${newFile.id}`);
        return newFile.id;
      }
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        console.log(
          `File with name '${name}' already exists in folder ${folderId}`
        );
        throw new Error('File already exists');
      }
      console.log('Error adding file:', error);
      throw error;
    }
  });
};

export const isFileExistInDB = async (folderId, fileName) => {
  return safeDBOperation(async () => {
    try {
      if (!fileName || !folderId) {
        throw new Error('File name and folder ID are required');
      }

      const db = await initDB();
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${FILES} WHERE name = ? AND folderId = ?`,
        [fileName, folderId]
      );

      return result && result.count > 0;
    } catch (error) {
      console.log('Error checking if file exists by name and folder:', error);
      throw error;
    }
  });
};

export const getFilesByFolder = async (folderId) => {
  return safeDBOperation(async () => {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      const db = await initDB();
      const result = await db.getAllAsync(
        `
            SELECT ${FILES}.id, ${FILES}.name, ${FILES}.type, ${FILES}.path, ${FILES}.isFavorite, ${FILES}.lastViewed, ${FILES}.size, ${FILES}.createDate
            FROM ${FILES}
            WHERE ${FILES}.folderId = ?
        `,
        [folderId]
      );

      return result;
    } catch (error) {
      console.log('Error fetching files by folder:', error);
      throw error;
    }
  });
};

export const updateFileName = async (newName, id) => {
  return safeDBOperation(async () => {
    if (!newName || !id) {
      throw new Error('New name and file ID are required');
    }
    try {
      const rowsUpdated = await updateElement(FILES, 'name', newName, 'id', id);
      if (rowsUpdated > 0) {
        console.log(`File name updated to '${newName}' for ID: ${id}`);
      }
      return rowsUpdated > 0;
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        console.log(`File name '${newName}' already exists in this folder`);
        throw new Error('alreadyExists');
      }
      throw error;
    }
  });
};

export const updateLastViewed = async (fileId) => {
  return safeDBOperation(async () => {
    if (!fileId) {
      throw new Error('File ID is required');
    }

    const timestamp = new Date().toISOString();
    const rowsUpdated = await updateElement(
      FILES,
      'lastViewed',
      timestamp,
      'id',
      fileId
    );
    if (rowsUpdated > 0) {
      console.log(`Updated lastViewed for file ${fileId}`);
    }
    return rowsUpdated > 0;
  });
};

export const markFileAsFavorite = async (value, fileId) => {
  return safeDBOperation(async () => {
    if (fileId === undefined || value === undefined) {
      throw new Error('File ID and favorite value are required');
    }

    // Ensure value is 0 or 1
    const favoriteValue = value ? 1 : 0;
    const rowsUpdated = await updateElement(
      FILES,
      'isFavorite',
      favoriteValue,
      'id',
      fileId
    );
    if (rowsUpdated > 0) {
      console.log(`Updated isFavorite=${favoriteValue} for file ${fileId}`);
    }
    return rowsUpdated > 0;
  });
};

export const updateFilePath = async (path, fileId) => {
  return safeDBOperation(async () => {
    if (!fileId || !path) {
      throw new Error('File ID and Path are required');
    }
    const rowsUpdated = await updateElement(
      FILES,
      'path',
      path,
      'id',
      fileId
    );
    if (rowsUpdated > 0) {
      console.log(`Updated filePath for file ${fileId}`);
    }
    return rowsUpdated > 0;
  });
};

export const deleteFileFromFolder = async (fileId) => {
  return safeDBOperation(async () => {
    if (!fileId) {
      throw new Error('File ID is required');
    }

    const rowsDeleted = await deleteRow(FILES, fileId);
    if (rowsDeleted > 0) {
      console.log(`File ID ${fileId} deleted successfully`);
    }
    return rowsDeleted > 0;
  });
};

// DEBUG FUNCTION - consider removing in production
export const printDB = async () => {
  return safeDBOperation(async () => {
    try {
      const user = await getTable(USER);
      const folders = await getTable(FOLDERS);
      const files = await getTable(FILES);
      const accessibility = await getTable(ACCESSIBILITY);

      console.log('User Table:', user);
      console.log('Folders Table:', folders);
      console.log('Files Table:', files);
      console.log('Accessibility Table:', accessibility);
    } catch (error) {
      console.log('Error printing database:', error);
    }
  });
};
