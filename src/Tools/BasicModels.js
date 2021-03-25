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

    static getMessageModel() {
        return {
            "messageId": "",
            "chatroom": "",
            "message": "",
            "senderUser": this.getUserModel(),
            "timestamp": 0,
            "received": false
        };
    }

    static getChatroomModel() {
        return {
            "chatroomId": "",
            "users": [],
            "chatroomName": "",
            "chatroomReceived": false
        };
    }

    static getUserModel() {
        return {
            "username": "",
            "fullname": "",
            "received": false
        };
    }

    static getNotificationQueueModel() {
        return {
            "notificationQueueId": "",
            "queue": "",
            "username": "",
            "notificationQueueType": null
        };
    }

    static getNotificationModel() {
        return {
            "notificationId": "",
            "timestamp": 0,
            "notificationType": null,
            "username": "",
            "received": false,
            "notificationQueue": this.getNotificationQueueModel()
        };
    }

    static NotificationTypeNewApplication() {
        return "NewApplication";
    }

    static NotificationTypeLabExchanged() {
        return "LabExchanged";
    }

    static NotificationTypeNewMessage() {
        return "NewMessage";
    }

    static NotificationTypeNone() {
        return "None";
    }

    static UserTypeStudent() {
        return "Student";
    }

    static UserTypeProfessor() {
        return "Professor";
    }

    static UserTypeBoth() {
        return "Both";
    }

} export default BasicModels;