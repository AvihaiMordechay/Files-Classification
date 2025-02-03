import * as FileSystem from 'expo-file-system';

const APP_DIRECTORY = FileSystem.documentDirectory + 'myFiles/';

/**
 * Checks if the app's storage directory exists, and creates it if not.
 * 
 * 🔹 Where is the data stored?  
 * - Inside `FileSystem.documentDirectory/myFiles/`, which is the app's internal storage.
 * 
 * 🔹 Input:  
 * - This function does not take any parameters.
 * 
 * 🔹 Output:  
 * - No return value. If the directory does not exist, it will be created.
 */
async function ensureAppDirectoryExists() {
    const dirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
    }
}

/**
 * Saves a user-selected file into the app's internal storage.
 * 
 * 🔹 Where is the data stored?  
 * - Inside `APP_DIRECTORY`, which is `FileSystem.documentDirectory/myFiles/`.
 * 
 * 🔹 Input:  
 * - `fileUri` (String) – The original path of the file selected by the user.  
 * - `fileName` (String) – The name under which the file will be saved in the app.
 * 
 * 🔹 Output:  
 * - Returns the new file path inside the app's storage if the operation succeeds.  
 * - Returns `null` in case of an error.
 */
export async function saveFileToAppStorage(fileUri, fileName) {
    try {
        await ensureAppDirectoryExists();
        const newFilePath = APP_DIRECTORY + fileName;
        await FileSystem.copyAsync({ from: fileUri, to: newFilePath });
        return newFilePath; // Returns the new file path
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
export async function readFile(filePath) {
    try {
        return await FileSystem.readAsStringAsync(filePath);
    } catch (error) {
        console.error('Error reading file:', error);
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


