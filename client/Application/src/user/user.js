
class User {
    // For new user that registered
    constructor(name, gender, email, imgPath) {
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.imgPath = imgPath; // TODO: change it to defulat icon until we will develop this feature!
        this.foldersCategories = null; // json: [{name: {filesCount: int, }}]
    }

}

export default User;