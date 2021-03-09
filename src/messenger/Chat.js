import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chat.css';

class Chat extends React.Component {

    constructor() {
        super();

        this.state = {
            "activeChatGet": {
                "activeChatOthersUsername": "",
                "activeChatMyQueue": "",
                "activeChatOthersQueue": ""
            },
            conversation: [],
            message: "",
            chatClient: null
        };

        this.getConversation = this.getConversation.bind(this);
        this.subscribeToConversation = this.subscribeToConversation.bind(this);
        this.subscribeMyQueueCallback = this.subscribeMyQueueCallback.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
        this.messageReceived = this.messageReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.chatFilter = this.chatFilter.bind(this);
        this.dateSince = this.dateSince.bind(this);
    }

    componentDidMount() {

        if(this.state.activeChatGet.activeChatOthersUsername !== this.props.activeChatGet.activeChatOthersUsername) {
            this.setState({
                activeChatGet: {
                    activeChatOthersUsername: this.props.activeChatGet.activeChatOthersUsername,
                    activeChatMyQueue: this.props.activeChatGet.activeChatMyQueue,
                    activeChatOthersQueue: this.props.activeChatGet.activeChatOthersQueue
                }
            }, 
                ()=>{this.getConversation()}
            );
        }

    }

    componentDidUpdate() {

        if(this.state.activeChatGet.activeChatOthersUsername !== this.props.activeChatGet.activeChatOthersUsername) {
            this.setState({
                activeChat: {
                    activeChatOthersUsername: this.props.activeChatGet.activeChatOthersUsername,
                    activeChatMyQueue: this.props.activeChatGet.activeChatMyQueue,
                    activeChatOthersQueue: this.props.activeChatGet.activeChatOthersQueue
                }
            }, 
                ()=>{this.getConversation()}
            );
        }

    }

    componentWillUnmount() {
        this.disconnectFromQueue();
    }

    async getConversation() {

        var url = "http://localhost:8082/messenger/conversation"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:this.props.activeChatGet.activeChatOthersUsername}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    var conversation = [];

                    if (res.body !== null) {
                        res.body.forEach((message) => {
                            conversation.push(message);
                        });
                    }
                    
                    this.setState({
                        conversation: conversation
                    }, () => {

                        this.chatFilter();

                        this.subscribeToConversation();

                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToConversation() {

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
                    "/queue/" + this.state.activeChatGet.activeChatMyQueue, 
                    this.subscribeMyQueueCallback,
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

    subscribeMyQueueCallback(object) {

        var message = JSON.parse(object.body);

        if(message.queueId === this.state.activeChatGet.activeChatMyQueue) {

            this.messageReceived(message);

            message.received = true;

        }

        var conversation = this.state.conversation;

        conversation.push(message);

        this.setState({
            conversation: conversation
        });

        this.chatFilter();

    }

    disconnectFromQueue() {

        if(this.state.client !== null && this.state.client !== undefined) {
            this.state.client.disconnect(()=>{
                console.log("disconected");
            });    
        }

    }

    async messageReceived(message) {

        var url = "http://localhost:8082/messenger/message-received"

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

        var url = "http://localhost:8082/messenger/message"

        var body = {
            "receiverUsername": this.props.activeChatGet.activeChatOthersUsername,
            "message": this.state.message
        };

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

                this.setState({
                    message: ""
                });

                this.chatFilter();

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
            var receiveOrSendCss = (message.queueId === this.props.activeChatGet.activeChatMyQueue) ? "sended" : "received";
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

        conversation = conversation.length > 0 ? conversation : "Write a message to " + this.props.activeChatGet.activeChatOthersUsername + "!";

        return(
            <div className="Chat">

                <div className="title">
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-users" />
                    </button>
                    <p>{this.props.activeChatGet.activeChatOthersUsername}</p>
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