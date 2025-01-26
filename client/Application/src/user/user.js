
class User {
    // For new user that registered
    constructor(firstName, lastName, gender, email, imgPath, foldersCategories) {
        this.firstName = firstName; // string
        this.lastName = lastName; // string
        this.gender = gender; // string: male / female
        this.email = email; // string
        this.imgPath = imgPath; // path to the profile icon
        this.foldersCategories = foldersCategories; // json: [{name: {filesCount: int, }}]
    }

}

export default User;