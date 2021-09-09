class ServiceHosts {

    static getAuthenticationHost() {
        return "https://lab-exchange-authentication.azurewebsites.net";
    }

    static getClassesHost() {
        return "https://lab-exchange-classes.azurewebsites.net";
    }

    static getNotificationsHost() {
        return "https://lab-exchange-notifications.azurewebsites.net";
    }

    static getSTOMPHost() {
        return "https://lab-exchange-notifications.azurewebsites.net/ws";
    }

    static getMessengerHost() {
        return "https://lab-exchange-messenger.azurewebsites.net";
    }

} export default ServiceHosts;