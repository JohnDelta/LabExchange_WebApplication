import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import BasicModels from '../Tools/BasicModels';
import './Chat.css';
import ServiceHosts from '../Tools/ServiceHosts.js';

class Chat extends React.Component {

    _isMounted = false;

    constructor() {
        super();

        this.state = {
            activeChatroom: null,
            conversation: [],
            conversationQueue: "",
            message: "",
            chatClient: null
        };

        this.getConversation = this.getConversation.bind(this);
        this.getConversationQueue = this.getConversationQueue.bind(this);
        this.subscribeToConversationQueue = this.subscribeToConversationQueue.bind(this);
        this.subscribeToConversationQueueCallback = this.subscribeToConversationQueueCallback.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
        //this.messageReceived = this.messageReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.chatFilter = this.chatFilter.bind(this);
        this.dateSince = this.dateSince.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if(this.state.activeChatroom !== this.props.activeChatroom) {
            this.setState({
                activeChatroom: this.props.activeChatroom
            }, 
                ()=>{this.getConversation()}
            );
        }
    }

    componentDidUpdate() {
        if(this.state.activeChatroom !== this.props.activeChatroom) {
            this.setState({
                activeChatroom: this.props.activeChatroom
            }, 
                ()=>{this.getConversation()}
            );
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.disconnectFromQueue();
    }

    async getConversation() {

        if (!this._isMounted) {return;}
        
        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            return;
        }

        var url = ServiceHosts.getMessengerHost()+"/messenger/conversation";

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:this.state.activeChatroom}),
            });

            if(response.status === 200) {

                response.json().then((res) => {
                    this.setState({
                        conversation: res.body
                    }, () => {
                        this.chatFilter();
                        if (this.state.conversationQueue === "") {
                            this.getConversationQueue();
                        }
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async getConversationQueue() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/conversation-queue";

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
                        conversationQueue: res.body.queue
                    }, () => {
                        this.subscribeToConversationQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToConversationQueue() {

        if (typeof this.state.conversationQueue === "undefined" || this.state.conversationQueue === "" || this.state.conversationQueue === null) {
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
                    "/queue/" + this.state.conversationQueue, 
                    this.subscribeToConversationQueueCallback,
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

    subscribeToConversationQueueCallback(object) {
        var message = JSON.parse(object.body);
        this.getConversation();
    }

    disconnectFromQueue() {
        if(this.state.client !== null && this.state.client !== undefined) {
            this.state.client.disconnect(()=>{
                //console.log("disconected");
            });    
        }
    }

    // async messageReceived(message) {

    //     let url = ServiceHosts.getMessengerHost()+"/messenger/message-received"

    //     try {

    //         const response = await fetch(url, {
    //             method: 'POST',
    //             cache: 'no-cache',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + localStorage.getItem("jwt")
    //             },
    //             body: JSON.stringify({body:message}),
    //         });

    //         if(response.status === 200) {
    //             // seen message
    //         }

    //     } catch (error) {console.log(error);}

    // }

    async sendMessage() {

        let url = ServiceHosts.getMessengerHost()+"/messenger/message";

        let body = BasicModels.getMessageModel();
        body.chatroom = this.state.activeChatroom;
        body.message = this.state.message;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:body}),
            });

            if(response.status === 200) {
                this.getConversation();
                this.setState({
                    message: ""
                });
            }

        } catch (error) {console.log(error);}

    }

    chatFilter() {

        var chatContainer = document.getElementById("chatContainer");

        chatContainer.scrollTop = chatContainer.scrollHeight;

        var conversation = this.state.conversation;

        conversation.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });

        this.setState({
            conversation: conversation
        });

    }

    onMessageChange(e) {
        this.setState({
            message: e.target.value
        });
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

    render() {

        var conversation = this.state.conversation.map((message, index) => {
            var receiveOrSendCss = (message.senderUser.username === localStorage.getItem("username")) ? "sended" : "received";
            return (
                <div className={"message-body "+receiveOrSendCss} key={"chat_conversation_"+index}>
                    <div className={"message "+receiveOrSendCss}>
                        {message.message}
                    </div>
                    <div className="info">
                        {this.dateSince(message.timestamp)}
                    </div>
                </div>
            );
        });

        conversation = conversation.length > 0 ? conversation : "Say Hello!";
        let conversationTitle = "";

        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            conversation = "Choose a conversation to send messages";
        } else {
            conversationTitle = this.state.activeChatroom.chatroomName;
        }

        return(
            <div className="Chat">

                <div className="title">
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-users" />
                    </button>
                    <p>{conversationTitle}</p>
                </div>

                <div className="container">

                    <div className="chat" id="chatContainer">
                        {conversation}
                    </div>

                    <div className="keyboard">
                        
                        <textarea 
                            placeholder="Hello"
                            value={this.state.message} 
                            onChange={this.onMessageChange}  />

                        <button onClick={this.sendMessage}>
                            <i className="fa fa-paper-plane" />
                        </button>

                    </div>

                </div>

            </div>
        );
    }

}

export default Chat;