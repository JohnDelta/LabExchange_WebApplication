class BasicModels {

    static getLabClassAndLabModel() {
        return new {
            "labClass": {
                "labClassId": 0,
                "name": "",
                "openForRegistrations": false
            },
            "lab": {
                "labId": 0,
                "name": ""
            }
        };
    }

    static getLabClassModel() {
        return new {
            "labClassId": 0,
            "name": "",
            "openForRegistrations": false
        };
    }

} export default BasicModels;