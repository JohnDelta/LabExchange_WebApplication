import React from 'react';
import './Header.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Authentication from '../authentication/Authentication';
import BasicModels from '../Tools/BasicModels';
import ServiceHosts from '../Tools/ServiceHosts.js';

class Header extends React.Component {

    _isMounted = false;

    constructor(props) {
        
        super(props);

        this.state = {
            notificationQueue: "",
            notifications: [],
            client: null
        };

        this.onTabClick = this.onTabClick.bind(this);
        this.toggleNotificationsPanel = this.toggleNotificationsPanel.bind(this);
        this.openNotification = this.openNotification.bind(this);
        this.attachNotificationPanelToButton = this.attachNotificationPanelToButton.bind(this);
        this.dateSince = this.dateSince.bind(this);
        this.loadNotifications = this.loadNotifications.bind(this);
        this.getNotificationQueue = this.getNotificationQueue.bind(this);
        this.subscribeToNoficationQueue = this.subscribeToNoficationQueue.bind(this);
        this.subscribeToNotificationQueueCallback = this.subscribeToNotificationQueueCallback.bind(this);
        this.getNotificationTitle = this.getNotificationTitle.bind(this);
        this.getNotificationLink = this.getNotificationLink.bind(this);
        this.notificationsFilter = this.notificationsFilter.bind(this);
        this.receiveNotification = this.receiveNotification.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.attachNotificationPanelToButton();

        // ref: https://stackoverflow.com/questions/641857/javascript-window-resize-event
        var addEvent = function(object, type, callback) {
            if (object == null || typeof(object) == 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on"+type] = callback;
            }
        };

        addEvent(window, "resize", this.attachNotificationPanelToButton);
        this.getNotificationQueue();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.disconnectFromQueue();
    }

    onTabClick(e) {
        
        let elements = document.getElementsByClassName("tab");
        for(let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active-tab");
        }
        e.target.classList.add("active-tab");

        this.props.history.push(e.target.id.split("_")[0]);
        
    }

    toggleNotificationsPanel(e) {

        let notificationsButtonElement = e.target;
        let notificationsPanelElement = document.getElementById("notificationsPanel");

        notificationsButtonElement.firstElementChild.classList.toggle("fa-times");
        notificationsButtonElement.firstElementChild.classList.toggle("fa-bell");

        notificationsPanelElement.classList.toggle("notifications-panel-active");

    }

    attachNotificationPanelToButton() {

        let notificationsButtonElement = document.getElementById("notificationsButton");
        let notificationsPanelElement = document.getElementById("notificationsPanel");

        if (notificationsButtonElement !== null && notificationsPanelElement !== null) {

            var rect = notificationsButtonElement.getBoundingClientRect();
            notificationsPanelElement.style.top = (rect.top + 50) + 'px';
            notificationsPanelElement.style.left = (rect.left - 215) + 'px';
        
        }

    }

    openNotification(e) {
        var vars = e.target.id.split("___");
        var link = vars[1];
        var notificationId = vars[2];
        this.receiveNotification(notificationId);
        this.props.history.push(link);
    }

    dateSince(pastDate) {

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

    async loadNotifications() {

        if (!this._isMounted) {return;}

        if (typeof this.state.notificationQueue === "undefined" || this.state.notificationQueue === "" || this.state.notificationQueue === null) {
            return;
        }

        let url = ServiceHosts.getNotificationsHost()+"/notifications/get/notifications";
        let data = BasicModels.getNotificationQueueModel();
        data.notificationQueueId = this.state.notificationQueue;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:data}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    this.setState({
                        notifications: res.body
                    }, () => {
                        this.notificationsFilter();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async getNotificationQueue() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/notification-queue";

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:""}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    this.setState({
                        notificationQueue: res.body.queue
                    }, () => {
                        this.loadNotifications();
                        this.subscribeToNoficationQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    subscribeToNoficationQueue() {

        if (typeof this.state.notificationQueue === "undefined" || this.state.notificationQueue === "" || this.state.notificationQueue === null) {
            return;
        }

        var ws = new SockJS(ServiceHosts.getNotificationsHost()+'/ws');
        var client = Stomp.over(ws);
        client.debug = null;

        var headers = {
          "login": "guest",
          "passcode": "guest",
          'X-Authorization': localStorage.getItem("jwt")
        };

        client.connect(
            headers, 
            () => {

                var subscription = client.subscribe(
                    "/queue/" + this.state.notificationQueue, 
                    this.subscribeToNotificationQueueCallback,
                    {'X-Authorization': localStorage.getItem("jwt")}
                );

            },(error) => { console.log(error); }
        );

        // client.heartbeat.outgoing = 1000; // client will send heartbeats every 20000ms
        // client.heartbeat.incoming = 0;

        this.setState({
            client: client
        });

    }

    subscribeToNotificationQueueCallback(object) {
        if (!this._isMounted) {return;}
        this.props.remountHeader();
        var message = JSON.parse(object.body);
        this.loadNotifications();
    }

    disconnectFromQueue() {
        if(this.state.client !== null && this.state.client !== undefined) {
            this.state.client.disconnect(()=>{
                //console.log("disconected");
            });    
        }
    }

    getNotificationTitle(notificationType) {
        
        let message = "";

        if (notificationType === BasicModels.NotificationTypeNewMessage()) {
            message = "You've got a new message!";
        } else if (notificationType === BasicModels.NotificationTypeLabExchanged()) {
            message = "You've Exchanged your lab!";
        } else if (notificationType === BasicModels.NotificationTypeNewApplication()) {
            message = "Someone applied to your post!";
        }

        return message;
    }

    getNotificationLink(notificationType) {
        
        let link = "";
        
        if (notificationType === BasicModels.NotificationTypeNewMessage()) {
            link = "/messenger";
        } else if (notificationType === BasicModels.NotificationTypeLabExchanged()) {
            link = "/my-labs";
        } else if (notificationType === BasicModels.NotificationTypeNewApplication()) {
            link = "/post/applications";
        }

        return link;
    }

    notificationsFilter() {
        if (!this._isMounted) {return;}

        var notifications = this.state.notifications;
        notifications.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        this.setState({
            notifications: notifications
        });
    }

    async receiveNotification(notificationId) {

        let url = ServiceHosts.getNotificationsHost()+"/notifications/notification-received";

        let data = BasicModels.getNotificationModel();
        data.notificationId = notificationId;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:data}),
            });

            if(response.status === 200) {

                response.json().then((res) => {
                });
            
            } else {}

        } catch (error) {console.log(error);}

    }
 
    render() {

        let unreceivedNotificationsNumber = this.state.notifications.filter(notification => !notification.received).length;
        let notificationsNumber = unreceivedNotificationsNumber > 0 ? <div className="notifications-button-total"><span>{unreceivedNotificationsNumber}</span></div> : '';
        notificationsNumber = unreceivedNotificationsNumber > 99 ? <div className="notifications-button-total"><span>99+</span></div> : notificationsNumber;
        
        let notifications = this.state.notifications.map((notification) => {
            let receivedCss = notification.received ? "notification-received" : "";
            return (
                <div className={"notification " + receivedCss}
                    onClick={this.openNotification}
                    key={"notification" + notification.notificationId}
                    id={"notification_" + notification.notificationId + "___" + this.getNotificationLink(notification.notificationType) + "___" + notification.notificationId}>
                    <div className="notification-message">{this.getNotificationTitle(notification.notificationType)}</div>
                    <div className="notification-time">{this.dateSince(notification.timestamp)}</div>
                </div>
            )
        });

        notifications = (notifications.length > 0) ? notifications : "You don't have any notifications yet.";

        return (
            <div className="Header">
                <div className="Header-body-wrapper">

                    <div className="upper">
                        <div className="title">
                            <span>LabExchange ({localStorage.getItem("username")})</span>
                        </div>

                        <button className="back-button" onClick={() => {Authentication.logout(this.props.history);}} >
                            <i className="fa fa-sign-out"></i>
                            <span>Exit</span>
                        </button>
                    </div>

                    <div className="lower">

                        <button
                            className={"tab " + ((this.props.activeTab === "class") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/classes_0">Classes</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "my-posts") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/post/my-posts_1">My Posts</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "applications") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/post/applications_2">Applications</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "messenger") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/messenger_3">Chat</button>

                        <button
                            className="notifications-button" 
                            id="notificationsButton"
                            onClick={this.toggleNotificationsPanel}>
                                <div className="notifications-button-body">
                                    <i className="fa fa-bell" />
                                    {notificationsNumber}
                                </div>
                        </button>

                        <div className="notifications-panel" id="notificationsPanel">
                            {notifications}
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default Header;