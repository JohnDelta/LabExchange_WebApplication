import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';

class SharedMethods {

    static async blockNotificationsFrom(notificationType) {

        let url = ServiceHosts.getNotificationsHost()+"/notifications/block-notifications-of-type";
        let notification = BasicModels.getNotificationModel();
        notification.notificationType = notificationType;
        let json = JSON.stringify({body:notification});

        this.authPost(url, json, (success)=>{}, (error)=>{});

    }

    static async authPost(url, jsonBody, sucessCallback, errorCallback) {

        // works for the lab exchange ResponseDTO model

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: jsonBody,
            });

            if(response.status === 200) {
                response.json().then((res) => {
                    if (res.status === 200) {
                        sucessCallback(res);
                    } else {
                        errorCallback();
                    }
                });
            } else {
                errorCallback();
            }

        } catch (error) {
            errorCallback();
        }

    }

    static dateSince(pastDate) {

        let secondsSince = Math.floor(Number(new Date() - new Date(pastDate)) / 1000);
        let minutesSince = Math.floor(Number(secondsSince) / 60);
        let hoursSince = Math.floor(Number(minutesSince) / 60);
        let daysSince = Math.floor(Number(hoursSince) / 24);
        
        let dateSince = "Seconds ago";
        if(minutesSince > 1 && minutesSince <= 59) {
            dateSince = minutesSince + " Minutes ago";
        }
        if(hoursSince > 0) {
          dateSince = hoursSince + " Hours ago";
        }
        if(daysSince > 0) {
          dateSince = daysSince + " Days ago";
        }

        return dateSince;
        
    }

} export default SharedMethods;