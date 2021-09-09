import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Header from '../../UIComponents/Header';
import BasicModels from '../../Tools/BasicModels';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class Messenger extends React.Component {

    _isMounted = false;

    constructor() {
        super();
    
        this.state = {
            "showChats": false,
            "activeChatroom": null,
            "chatroomsQueue": "",
            "client": null,
            "subscription": null,
            "chatsKey": Math.random()
        };
    
        this.toggleChats = this.toggleChats.bind(this);
        this.activeChatSet = this.activeChatSet.bind(this);
        this.remountHeaderFromMessenger = this.remountHeaderFromMessenger.bind(this);
        this.getChatroomsQueue = this.getChatroomsQueue.bind(this);
        this.subscribeToChatroomsQueue = this.subscribeToChatroomsQueue.bind(this);
        this.subscribeToChatroomsQueueCallback = this.subscribeToChatroomsQueueCallback.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
        this.chatroomReceived = this.chatroomReceived.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNewMessage());
        this.getChatroomsQueue();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.disconnectFromQueue();
    }

    remountHeaderFromMessenger() {
        this.setState({
            remountHeaderValue: Math.random()
        });
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
        });
    }

    activeChatSet(chatroom) {
        this.setState({
            activeChatroom: chatroom
        });
    }

    async getChatroomsQueue() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/chatrooms-queue";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                chatroomsQueue: sucess.body.queue
            }, () => {
                this.subscribeToChatroomsQueue();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async subscribeToChatroomsQueue() {

        if (typeof this.state.chatroomsQueue === "undefined" || this.state.chatroomsQueue === "" || this.state.chatroomsQueue === null) {
            return;
        }

        var ws = new SockJS(ServiceHosts.getNotificationsHost()+'/ws');
        var client = Stomp.over(ws);
        client.debug = null;

        var headers = {
            "login": "admin",
            "passcode": "adminADMIN",
            'X-Authorization': localStorage.getItem("jwt")
        };

        client.connect(
            headers, 
            () => {

                var subscription = client.subscribe(
                    "/queue/" + this.state.chatroomsQueue, 
                    this.subscribeToChatroomsQueueCallback,
                    {'X-Authorization': localStorage.getItem("jwt")}
                );

                this.setState({
                    subscription: subscription
                });

            },(error) => { console.log(error); }
        );

        // client.heartbeat.outgoing = 1000; // client will send heartbeats every 20000ms
        // client.heartbeat.incoming = 0;

        this.setState({
            client: client
        });

    }

    subscribeToChatroomsQueueCallback(object) {
        let chatroomId = JSON.parse(object.body).messageBody;
        if (typeof this.state.activeChatroom !== "undefined" 
            && this.state.activeChatroom !== null 
            && this.state.activeChatroom !== ""
            && this._isMounted
            && chatroomId === this.state.activeChatroom.chatroomId) {
            this.chatroomReceived();
        } else {
            this.setState({
                chatsKey: Math.random()
            });
        }
    }

    disconnectFromQueue() {
        if (typeof this.state.subscription !== "undefined" && this.state.subscription !== null) {
            this.state.subscription.unsubscribe();
            this.setState({subscription: null});    
        }

        if (typeof this.state.client !== "undefined" && this.state.client !== null) {
            this.state.client.disconnect();
            this.setState({client: null});
        }
    }

    async chatroomReceived() {
        if (typeof this.state.activeChatroom === "undefined" 
            || this.state.activeChatroom === null 
            || this.state.activeChatroom === "") {
            return;
        }
        var url = ServiceHosts.getMessengerHost()+"/messenger/student/chatroom-received";
        var jsonBody = JSON.stringify({body: this.state.activeChatroom});
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                chatsKey: Math.random()
            });
        }, (err) => {Authentication.logout(this.props.history);});
    }

    render() {
        return(
            <div className="MessengerWrapper">
                <div className="Messenger">

                    <Header 
                        activeTab={"messenger"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromMessenger} 
                        key={this.state.remountHeaderValue} />

                    <div className="messenger-content">
                        <Chats 
                            toggleChats={this.toggleChats} 
                            showChats={this.state.showChats} 
                            activeChatSet={this.activeChatSet}
                            chatroomsQueue={this.state.chatroomsQueue}
                            key={this.state.chatsKey} />

                        <Chat 
                            toggleChats={this.toggleChats} 
                            activeChatroom={this.state.activeChatroom} />
                    </div>

                </div>
            </div>
        );
    }

}

export default Messenger;