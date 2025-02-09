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
        console.error('Error creating directory:', error);
        return false;
    }
}

export async function saveFileToAppStorage(fileUri, fileName) {
    if (!fileUri || !fileName) {
        console.error('Invalid file URI or filename');
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

        const newFilePath = APP_DIRECTORY + fileName;
        await FileSystem.copyAsync({
            from: fileUri,
            to: newFilePath
        });

        // Verify the file was copied successfully
        const newFileExists = await FileSystem.getInfoAsync(newFilePath);
        if (!newFileExists.exists) {
            throw new Error('File copy failed');
        }

        return newFilePath;
    } catch (error) {
        console.error('Error saving file:', error);
        return null;
    }
}

/**
 * Reads the content of a given file and returns it as a string.
 * 
 * 🔹 Where is the data stored?  
 * - The data remains in the app's storage system (`APP_DIRECTORY`).
 * 
 * 🔹 Input:  
 * - `filePath` (String) – The full path of the file to be read.
 * 
 * 🔹 Output:  
 * - Returns the file content as a string (`String`) if the read operation is successful.  
 * - Returns `null` in case of an error.
 */
//need to check if this function is really needed and also the delete function 
export async function getFileInfo(filePath) {
    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
            throw new Error('File does not exist');
        }
        return fileInfo;
    } catch (error) {
        console.error('Error getting file info:', error);
        return null;
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
        console.error('Error deleting file:', error);
        return false;
    }
}


