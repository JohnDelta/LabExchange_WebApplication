import React from 'react';
import './Header.css';
import Authentication from '../authentication/Authentication';

class Header extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            notifications: [
                {
                    "notificationId": 0,
                    "referencedLink": "/classes",
                    "title": "A new class has oppened",
                    "timestamp": 23234234234
                },
                {
                    "notificationId": 1,
                    "referencedLink": "/messenger",
                    "title": "You have a new message",
                    "timestamp": 23234234234
                },
                {
                    "notificationId": 2,
                    "referencedLink": "/class/0",
                    "title": "You've been assigned to another class",
                    "timestamp": 23234234234
                }
            ]
        };

        this.onTabClick = this.onTabClick.bind(this);
        this.toggleNotificationsPanel = this.toggleNotificationsPanel.bind(this);
        this.openNotification = this.openNotification.bind(this);
        this.attachNotificationPanelToButton = this.attachNotificationPanelToButton.bind(this);
        this.dateSince = this.dateSince.bind(this);
    
    }

    componentDidMount() {

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

        var link = e.target.id.split("_")[2];

        this.props.history.push(link);

    }

    dateSince(pastDate) {

        let secondsSince = Math.floor(Number(new Date() - new Date(pastDate)) / 1000);
        let minutesSince = Math.floor(Number(secondsSince) / 60);
        let hoursSince = Math.floor(Number(minutesSince) / 60);
        let daysSince = Math.floor(Number(hoursSince) / 24);
        
        let dateSince = "Seconds ago";
        if(minutesSince === 1) {
            dateSince = minutesSince + " Minute ago";
        } else {
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

    render() {

        let notifications = this.state.notifications.map((notification) => {
            return (
                <div className="notification"
                    onClick={this.openNotification}
                    key={"notification" + notification.notificationId}
                    id={"notification_" + notification.notificationId + "_" + notification.referencedLink}>
                    <div className="notification-message">{notification.title}</div>
                    <div className="notification-time">{this.dateSince(notification.timestamp)}</div>
                </div>
            )
        });

        return (
            <div className="Header">
                <div className="Header-body-wrapper">

                    <div className="upper">
                        <div className="title">
                            <span>LabExchange</span>
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
                                <i className="fa fa-bell" />
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