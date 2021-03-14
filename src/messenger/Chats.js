import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chats.css';

import {withRouter} from 'react-router-dom';

class Chats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chatrooms: [],
            chatroomsQueue: "",
            client: null,
            chatroomId: "",
            activeChatroom: null
        };

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

    componentDidMount() {
        if (typeof this.props.match !== "undefined") {
            this.setState({
                chatroomId: this.props.match.params.username
            }, () => {
                this.initializeActiveChatroom();
            });
        } else {
            this.getChatrooms();
        }
    }

    componentWillUnmount() {
        this.disconnectFromQueue();
    }

    async getChatrooms() {

        var url = "http://localhost:8082/messenger/chatrooms";

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

                                let matchChatroom = this.state.chatrooms.filter(chatroom => {
                                    chatroom.chatroomId === this.state.activeChatroom.chatroomId
                                });

                                if (matchChatroom === null || typeof matchChatroom === "undefined") {
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

        var url = "http://localhost:8082/notifications/get/chatrooms-queue";

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
                        chatroomsQueue: res.body
                    }, () => {
                        this.subscribeToChatroomsQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToChatroomsQueue() {

        var ws = new SockJS('http://localhost:8082/ws');
        var client = Stomp.over(ws);

        var headers = {
          "login": "guest",
          "passcode": "guest",
          'X-Authorization': localStorage.getItem("jwt")
        };

        if (this.state.chatroomsQueue !== "") {

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

    }

    async chatroomReceived() {

        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            return;
        }

        var url = "http://localhost:8083/messenger/chatroom-received";

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

                response.json().then((res) => {
                });
            
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

    async initializeActiveChatroom() {

        if (typeof this.state.chatroomId === "undefined" || this.state.chatroomId === "") {
            return;
        }

        var url = "http://localhost:8082/messenger/get/chatroom";

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:this.state.chatroomId}),
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

    onChatClick(e) {
        var othersUsername = e.target.id.split("____")[1];
        this.props.history.push("/messenger/"+othersUsername);
        this.activateChat();
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
            var newMessagesIcon = (!this.isChatroomReceived(conversation)) ? "" : <i className="fa fa-comment" />;
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