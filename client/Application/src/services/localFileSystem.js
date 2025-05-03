import * as FileSystem from 'expo-file-system';

const APP_DIRECTORY = FileSystem.documentDirectory + 'myFiles/';

async function ensureAppDirectoryExists() {
    try {
        const dirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
        }
        return true;
    } catch (error) {
        console.log('Error creating directory:', error);
        return false;
    }
}

export async function saveFileToAppStorage(fileUri, fileName, folderId) {
    if (!fileUri || !fileName) {
        console.log('Invalid file URI or filename');
        return null;
    }

    try {
        const directoryCreated = await ensureAppDirectoryExists();
        if (!directoryCreated) {
            throw new Error('Failed to create app directory');
        }

        // Verify source file exists
        const sourceExists = await FileSystem.getInfoAsync(fileUri);
        if (!sourceExists.exists) {
            throw new Error('Source file does not exist');
        }

        const folderPath = APP_DIRECTORY + folderId + "/";
        const newFilePath = folderPath + fileName;

        // Check if the folder for the user exists, create if not
        const folderInfo = await FileSystem.getInfoAsync(folderPath);
        if (!folderInfo.exists) {
            await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
        }

        // Check if target file already exists
        const existingFile = await FileSystem.getInfoAsync(newFilePath);
        if (existingFile.exists) {
            throw new Error('File with the same name already exists');
        }

        await FileSystem.copyAsync({
            from: fileUri,
            to: newFilePath
        });

        return newFilePath;
    } catch (error) {
        console.log('Error saving file:', error);
        throw error;
    }
}


export async function fileExistsInStorage(folderId, fileName) {
    try {
        const directoryCreated = await ensureAppDirectoryExists();
        if (!directoryCreated) {
            throw new Error('Failed to create app directory');
        }

        const filePath = APP_DIRECTORY + folderId + "/" + fileName;

        const fileInfo = await FileSystem.getInfoAsync(filePath);
        return fileInfo.exists;
    } catch (error) {
        console.log('Error checking if file exists in storage:', error);
        throw error;
    }
}

/**
 * Deletes a file from the app's storage.
 * 
 * 🔹 Where is the data stored?  
 * - The file exists in the app's storage (`APP_DIRECTORY`), and when deleted, it is permanently removed.
 * 
 * 🔹 Input:  
 * - `filePath` (String) – The full path of the file to be deleted.
 * 
 * 🔹 Output:  
 * - Returns `true` if the file was successfully deleted.  
 * - Returns `false` in case of an error.
 */
export async function deleteFile(filePath) {
    try {
        await FileSystem.deleteAsync(filePath);
        console.log(`File deleted: ${filePath}`);
        return true;
    } catch (error) {
        console.log('Error deleting file:', error);
        return false;
    }
}
