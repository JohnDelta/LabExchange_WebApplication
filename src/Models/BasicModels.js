class BasicModels {

    static getLabClassAndLabModel() {
        return {
            "labClass": this.getLabClassModel(),
            "lab": this.getLabModel()
        };
    }

    static getLabClassModel() {
        return {
            "labClassId": 0,
            "name": "",
            "openForRegistrations": false
        };
    }

    static getPostModel() {
        return {
            "postId": 0,
            "timestamp": 0,
            "username": "",
            "requestedLab": {},
            "providedLab": {},
            "labClass": this.getLabClassModel(),
            "applications": []
        };
    }

    static getLabModel() {
        return {
            "labId": 0,
            "name": "",
            "labClass": this.getLabClassModel()
        };
    }

} export default BasicModels;