import React from 'react';
import './Header.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import BasicModels from '../Tools/BasicModels';
import ServiceHosts from '../Tools/ServiceHosts';
import SharedMethods from '../Tools/SharedMethods';
import Authentication from '../authentication/Authentication';

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
        this.loadNotifications = this.loadNotifications.bind(this);
        this.getNotificationQueue = this.getNotificationQueue.bind(this);
        this.subscribeToNoficationQueue = this.subscribeToNoficationQueue.bind(this);
        this.subscribeToNotificationQueueCallback = this.subscribeToNotificationQueueCallback.bind(this);
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

        let icon = notificationsButtonElement.firstElementChild.firstElementChild;

        icon.classList.toggle("fa-times");
        icon.classList.toggle("fa-bell");

        notificationsPanelElement.classList.toggle("notifications-panel-active");

    }

    attachNotificationPanelToButton() {

        let notificationsButtonElement = document.getElementById("notificationsButton");
        let notificationsPanelElement = document.getElementById("notificationsPanel");

        if (notificationsButtonElement !== null && notificationsPanelElement !== null) {

            var rect = notificationsButtonElement.getBoundingClientRect();
            notificationsPanelElement.style.top = (rect.top + 50) + 'px';
            notificationsPanelElement.style.left = (rect.left - 300) + 'px';
        
        }

    }

    openNotification(e) {
        var vars = e.target.id.split("___");
        var link = vars[1];
        var notificationId = vars[2];
        this.receiveNotification(notificationId);
        this.props.history.push(link);
    }

    async loadNotifications() {

        if (!this._isMounted) {return;}

        if (typeof this.state.notificationQueue === "undefined" || this.state.notificationQueue === "" || this.state.notificationQueue === null) {
            return;
        }

        let url = ServiceHosts.getNotificationsHost()+"/notifications/get/notifications";
        let data = BasicModels.getNotificationQueueModel();
        data.notificationQueueId = this.state.notificationQueue;
        let jsonBody = JSON.stringify({body:data});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                notifications: sucess.body
            }, () => {
                this.notificationsFilter();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async getNotificationQueue() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/notification-queue";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                notificationQueue: sucess.body.queue
            }, () => {
                this.loadNotifications();
                this.subscribeToNoficationQueue();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    subscribeToNoficationQueue() {

        if (!this._isMounted) {return;}
        
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
        if(this.state.client !== null && typeof this.state.client !== "undefined") {
            // make sure you wait to actualy have a connection before you try to disconect from it
            setTimeout(() => {
                this.state.client.disconnect();
            }, 500);    
        }
    }

    getNotificationLink(notificationType, id) {
        
        let link = "";
        
        if (notificationType === BasicModels.NotificationTypeNewMessage()) {
            link = "/student/messenger/chatroom/" + id;
        } else if (notificationType === BasicModels.NotificationTypeLabExchanged()) {
            link = "/student/my-labs";
        } else if (notificationType === BasicModels.NotificationTypeNewApplication()) {
            link = "/student/post/my-posts";
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
        let jsonBody = JSON.stringify({body:data}); 

        SharedMethods.authPost(url, jsonBody, (sucess) => {}, (err) => {});

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
                    id={"notification_" + notification.notificationId + "___" + this.getNotificationLink(notification.notificationType, notification.messageBody) + "___" + notification.notificationId}>
                    <div className="notification-message" dangerouslySetInnerHTML={{ __html: notification.messageTitle}} />
                    <div className="notification-time">{SharedMethods.dateSince(notification.timestamp)}</div>
                </div>
            )
        });

        notifications = (notifications.length > 0) ? notifications : "You don't have any notifications yet.";

        let lowerLayoutCss = "lower-layout-2-columns";
        let studentButtons = [];
        if (localStorage.getItem("userType") === BasicModels.UserTypeStudent()) {
            studentButtons.push(
                <button
                    className={"tab " + ((this.props.activeTab === "my-posts") ? "active-tab" : "")} 
                    onClick={this.onTabClick} 
                    id="/student/post/my-posts_1" 
                    key="header_student_mypost">My Posts</button>,
                <button
                    className={"tab " + ((this.props.activeTab === "applications") ? "active-tab" : "")} 
                    onClick={this.onTabClick} 
                    id="/student/post/applications_2"
                    key="header_student_applications">Applications</button>,
                <button
                    className={"tab " + ((this.props.activeTab === "messenger") ? "active-tab" : "")} 
                    onClick={this.onTabClick} 
                    id="/student/messenger_3"
                    key="header_student_messenger">Chat</button>
            );
            lowerLayoutCss = "";
        }

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

                    <div className={"lower" + " " + lowerLayoutCss}>

                        <button
                            className={"tab " + ((this.props.activeTab === "class") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id={"/" + localStorage.getItem("userType").toLowerCase() + "/classes_0"}>Classes</button>

                        {studentButtons}

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