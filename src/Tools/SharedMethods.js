import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';

class SharedMethods {

    static async blockNotificationsFrom(notificationType) {

        let url = ServiceHosts.getNotificationsHost()+"/notifications/block-notifications-of-type";

        let notification = BasicModels.getNotificationModel();
        notification.notificationType = notificationType;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:notification}),
            });

            if(response.status === 200) {
            
            } else {}

        } catch (error) {console.log(error);}

    }

} export default SharedMethods;