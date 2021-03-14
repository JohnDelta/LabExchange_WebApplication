import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chats.css';
import ServiceHosts from '../Tools/ServiceHosts.js';

import {withRouter} from 'react-router-dom';

class Chats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chatrooms: [],
            chatroomsQueue: "",
            client: null,
            chatroomId: "",
            receiverUsername: "",
            activeChatroom: null
        };

        this.initializeChat = this.initializeChat.bind(this);
        this.getChatrooms = this.getChatrooms.bind(this);
        this.getChatroomsQueue = this.getChatroomsQueue.bind(this);
        this.subscribeToChatroomsQueue = this.subscribeToChatroomsQueue.bind(this);
        this.subscribeToChatroomsQueueCallback = this.subscribeToChatroomsQueueCallback.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
        this.activateChat = this.activateChat.bind(this);
        this.onChatClick = this.onChatClick.bind(this);
        this.initializeActiveChatroom = this.initializeActiveChatroom.bind(this);
        this.isChatroomReceived = this.isChatroomReceived.bind(this);
        this.chatroomReceived = this.chatroomReceived.bind(this);
    }

    initializeChat() {
        if (typeof this.props.match !== "undefined" && typeof this.props.match.params !== "undefined") {
            if (typeof this.props.match.params.chatroomId !== "undefined") {
                this.setState({
                    chatroomId: this.props.match.params.chatroomId
                }, () => {
                    this.initializeActiveChatroom("chatroomId");
                });
            } else if (typeof this.props.match.params.username !== "undefined") {
                this.setState({
                    receiverUsername: this.props.match.params.username
                }, () => {
                    this.initializeActiveChatroom("receiverUsername");
                });
            } else {
                this.getChatrooms();    
            }
        } else {
            this.getChatrooms();
        }
    }

    componentDidMount() {
        this.initializeChat();
    }

    componentDidUpdate() {
        if (typeof this.props.match !== "undefined" && typeof this.props.match.params !== "undefined") {
            if (typeof this.props.match.params.chatroomId !== "undefined") {
                if (this.state.chatroomId !== this.props.match.params.chatroomId) {
                    this.setState({
                        chatroomId: this.props.match.params.chatroomId
                    }, () => {
                        this.initializeChat();
                    });
                }
            } else if (typeof this.props.match.params.username !== "undefined") {
                if (this.state.receiverUsername !== this.props.match.params.username) {
                    this.setState({
                        receiverUsername: this.props.match.params.username
                    }, () => {
                        this.initializeChat();
                    });
                }
            }
        }
    }

    componentWillUnmount() {
        this.disconnectFromQueue();
    }

    async initializeActiveChatroom(commingFrom) {

        var url = "";
        var data = "";
        if (commingFrom === "receiverUsername") {
            if (typeof this.state.receiverUsername === "undefined" || this.state.receiverUsername === "") {
                return;
            }
            url = ServiceHosts.getMessengerHost()+"/messenger/chatroom/initialize";
            data = this.state.receiverUsername;
        } else if (commingFrom === "chatroomId") {
            if (typeof this.state.chatroomId === "undefined" || this.state.chatroomId === "") {
                return;
            }
            url = ServiceHosts.getMessengerHost()+"/messenger/get/chatroom";
            data = this.state.chatroomId;
        }

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
                        activeChatroom: res.body
                    }, () => {
                        this.getChatrooms();
                        this.activateChat();
                    });
                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async getChatrooms() {

        var url = ServiceHosts.getMessengerHost()+"/messenger/chatrooms";

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
                        chatrooms: res.body
                    }, () => {

                        this.getChatroomsQueue();
                        
                        if (typeof this.state.activeChatroom !== "undefined" && 
                            this.state.activeChatroom !== null &&
                            this.state.activeChatroom.chatroomId !== "") {

                                let matchChatroom = this.state.chatrooms.filter(chatroom => chatroom.chatroomId === this.state.activeChatroom.chatroomId);
                                
                                if (matchChatroom === null || typeof matchChatroom === "undefined" || matchChatroom.length < 1) {
                                    var chatrooms = this.state.chatrooms;
                                    chatrooms.push(this.state.activeChatroom);
                                    this.setState({
                                        chatrooms: chatrooms
                                    });
                                }
                        }

                    });
                });

            } else {}

        } catch (error) {console.log(error);}

    }

    async getChatroomsQueue() {

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/chatrooms-queue";

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
                        chatroomsQueue: res.body.queue
                    }, () => {
                        this.subscribeToChatroomsQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToChatroomsQueue() {

        if (typeof this.state.chatroomsQueue === "undefined" || this.state.chatroomsQueue === "" || this.state.chatroomsQueue === null) {
            return;
        }

        var ws = new SockJS(ServiceHosts.getNotificationsHost()+'/ws');
        var client = Stomp.over(ws);

        var headers = {
          "login": "guest",
          "passcode": "guest",
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

            },(error) => { console.log(error); }
        );

        client.heartbeat.outgoing = 1000; // client will send heartbeats every 20000ms
        client.heartbeat.incoming = 0;

        this.setState({
            client: client
        });

    }

    async chatroomReceived() {

        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            return;
        }

        var url = ServiceHosts.getMessengerHost()+"/messenger/chatroom-received";

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body: this.state.activeChatroom}),
            });

            if(response.status === 200) {
            
            } else {}

        } catch (error) {console.log(error);}

    }

    subscribeToChatroomsQueueCallback(object) {
        var othersUsername = object.body;
        this.getChatrooms();
    }

    disconnectFromQueue() {
        if(this.state.client !== null && typeof this.state.client !== "undefined") {
            this.state.client.disconnect(()=>{
                console.log("disconected");
            });    
        }
    }

    activateChat() {
        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            return;
        }
        this.props.activeChatSet(this.state.activeChatroom);
        this.chatroomReceived();
    }

    onChatClick(e) {
        var chatroomId = e.target.id.split("____")[1];
        this.props.history.push("/messenger/chatroom/"+chatroomId);
    }

    isChatroomReceived(chatroom) {

        let isReceived = false;
        chatroom.users.forEach(user => {
            if (user.received && user.username === localStorage.getItem("username")) {
                isReceived = true;
            }
        });
        
        return isReceived;

    }

    render() {

        var showChatsCss = (this.props.showChats) ? "" : "showPanelFromLeft";

        var chats = this.state.chatrooms.map((conversation, index) => {
            var newMessagesIcon = (this.isChatroomReceived(conversation)) ? "" : <i className="fa fa-comment" />;
            return (
                <div className="chat" key={"chats_index"+index}>
                    <div className="title" 
                        id={"conversations____"+conversation.chatroomId}
                        onClick={this.onChatClick}>
                            {conversation.chatroomName}
                            {newMessagesIcon}
                    </div>
                </div>
            );
        });
        
        chats = (chats.length > 0) ? chats : "No Conversations Active";

        return(
            <div className={"Chats hidePanelToLeft " + showChatsCss}>

                <div className="title">
                    <p>chatrooms</p>
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-times-circle" />
                    </button>
                </div>

                <div className="container">
                    {chats}
                </div>

            </div>
        );
    }

}

export default withRouter(Chats);