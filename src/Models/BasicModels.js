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

    static getApplicationModel() {
        return {
            "applicationId": 0,
            "timestamp": 0,
            "user": {
                "username": "",
                "name": "",
                "lastname": "",
                "userId": ""
            },
            "post": this.getPostModel()
        };
    }

} export default BasicModels;