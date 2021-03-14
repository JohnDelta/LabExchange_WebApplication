import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import BasicModels from '../Models/BasicModels';
import './Chat.css';

class Chat extends React.Component {

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
        this.messageReceived = this.messageReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.chatFilter = this.chatFilter.bind(this);
        this.dateSince = this.dateSince.bind(this);
    }

    componentDidMount() {
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
        this.disconnectFromQueue();
    }

    async getConversation() {

        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            return;
        }

        var url = "http://localhost:8082/messenger/conversation"

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

        var url = "http://localhost:8082/notifications/get/conversation-queue";

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
                        conversationQueue: res.body
                    }, () => {
                        this.subscribeToConversationQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToConversationQueue() {

        var ws = new SockJS('http://localhost:8082/ws');
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
                    "/queue/" + this.state.conversationQueue, 
                    this.subscribeToConversationQueueCallback,
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

    subscribeToConversationQueueCallback(object) {
        var message = JSON.parse(object.body);
        this.getConversation();
    }

    disconnectFromQueue() {
        if(this.state.client !== null && this.state.client !== undefined) {
            this.state.client.disconnect(()=>{
                console.log("disconected");
            });    
        }
    }

    async messageReceived(message) {

        let url = "http://localhost:8083/messenger/message-received"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:message}),
            });

            if(response.status === 200) {
                // seen message
            }

        } catch (error) {console.log(error);}

    }

    async sendMessage() {

        let url = "http://localhost:8083/messenger/message";

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

        conversation = (this.state.activeChatroom.activeChatOthersQueue === "") ? "No conversations available" : conversation;

        return(
            <div className="Chat">

                <div className="title">
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-users" />
                    </button>
                    <p>{this.props.activeChatroom.activeChatOthersUsername}</p>
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