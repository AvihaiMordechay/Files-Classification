import {
    getFoldersDetails,
    getFilesByFolder,
    getUserDetails,
    getAllFavoritesFiles,
    createDB,
    printDB

} from "../services/database";
import { Alert } from 'react-native';

class User {
    async initDB() {
        try {
            const userDetails = await getUserDetails();
            this.name = userDetails.name;
            this.gender = userDetails.gender;
            this.email = userDetails.email;
            this.imgPath = null; // TODO: change it to defulat icon until we will develop this feature!
            this.folders = await this.loadFoldersFromDB();
            this.favoritesFiles = await getAllFavoritesFiles();
            console.log("The DB init passed!");
        } catch (error) {
            Alert.alert(error);
            throw error;
        }
    }

    async createDB(id, name, gender, email) {
        try {
            await createDB(id, name, gender, email);
            this.name = name;
            this.gender = gender;
            this.email = email;
            this.imgPath = null; // TODO: change it to defulat icon until we will develop this feature!
            this.folders = [];
            this.favoritesFiles = [];
        } catch (error) {
            Alert.alert('Error', error.message);
            throw error;
        }
    }


    async loadFoldersFromDB() {
        try {
            const foldersDetails = await getFoldersDetails();

            const folders = await Promise.all(
                foldersDetails.map(async (folder) => {
                    const files = await getFilesByFolder(folder.id);

                    return {
                        id: folder.id,
                        name: folder.name,
                        filesCount: folder.filesCount,
                        files: files
                    };
                })
            )
            return folders;
        } catch (error) {
            console.error("Error with load folder from DB: ", error);
            return [];
        }
    }

    getFoldersNames() {
        const folderNames = []
        this.folders.map((folder) => {
            folderNames.push(folder.name);
        })
        return folderNames;
    }

    async setUserName(name) {
        try {

        } catch (error) {

        }
    }
    async printData() {
        await printDB();
    }



}

export default User;