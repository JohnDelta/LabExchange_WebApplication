import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chat.css';

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeChatOthersUsername: "",
            activeChatMyQueue: "",
            activeChatOthersQueue: "",
            conversation: [],
            message: ""
        };

        this.getConversation = this.getConversation.bind(this);
        this.subscribeToConversation = this.subscribeToConversation.bind(this);
        this.subscribeMyQueueCallback = this.subscribeMyQueueCallback.bind(this);
        //this.subscribeOthersQueueCallback = this.subscribeOthersQueueCallback.bind(this);
        this.messageReceived = this.messageReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
    }

    componentDidMount() {

        if(this.state.activeChatOthersUsername !== this.props.activeChatOthersUsername) {
            this.setState({
                activeChatOthersUsername: this.props.activeChatOthersUsername,
                activeChatMyQueue: this.props.activeChatMyQueue,
                activeChatOthersQueue: this.props.activeChatOthersQueue
            }, 
                ()=>{this.getConversation()}
            );
        }

    }

    componentDidUpdate() {

        if(this.state.activeChatOthersUsername !== this.props.activeChatOthersUsername) {
            this.setState({
                activeChatOthersUsername: this.props.activeChatOthersUsername,
                activeChatMyQueue: this.props.activeChatMyQueue,
                activeChatOthersQueue: this.props.activeChatOthersQueue
            }, 
                ()=>{this.getConversation()}
            );
        }

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
                body: JSON.stringify({body:this.props.activeChatOthersUsername}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    var conversation = [];

                    // Show my messages which I've seen, and the others which I've send.
                    // The ones which I'havent received yet will come from the subsribe
                    if (res.body !== null) {
                        res.body.forEach((message) => {
                            
                            conversation.push(message);

                        });
                    }
                    
                    this.setState({
                        conversation: conversation
                    }, () => {

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
                    "/queue/" + this.state.activeChatMyQueue, 
                    this.subscribeMyQueueCallback,
                    {'X-Authorization': localStorage.getItem("jwt")}
                );

            },(error) => { console.log(error); }
        );

    }

    subscribeMyQueueCallback(object) {

        var message = JSON.parse(object.body);

        if(message.directChatroomId === this.state.activeChatMyQueue) {

            this.messageReceived(message);

            message.received = true;

        }

        var conversation = this.state.conversation;

        conversation.push(message);

        this.setState({
            conversation: conversation
        });

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
            "receiverUsername": this.props.activeChatOthersUsername,
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

                // response.json().then((object)=>{

                //     var conversation = this.state.conversation;

                //     conversation.push(object.body);

                //     this.setState({
                //         conversation: conversation
                //     });

                // });

                this.setState({
                    message: ""
                });
            }

        } catch (error) {console.log(error);}

    }

    onMessageChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    render() {

        var conversation = "Select a user to chat with";

        if(this.props.activeChatOthersUsername !== "") {
            
            conversation = "Write a message to " + this.props.activeChatOthersUsername + "!";
            
        }

        if(this.state.conversation.length > 0) {

            conversation = [];

            this.state.conversation.forEach((message, index) => {

                var receiveOrSendCss = "sended";
                if(message.directChatroomId !== this.props.activeChatOthersQueue) {
                    receiveOrSendCss = "received";
                }

                conversation.push(
                    <div className={"message-body "+receiveOrSendCss} key={"chat_conversation_"+index}>
                        <div className={"message "+receiveOrSendCss}>
                            {message.message}
                        </div>
                        <div className="info">
                            Received 20 Hours ago
                        </div>
                    </div>
                );

            });

        }

        return(
            <div className="Chat">

                <div className="title">
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-users" />
                    </button>
                    <p>{this.props.activeChatOthersUsername}</p>
                </div>

                <div className="container">

                    <div className="chat">
                        
                        {conversation}

                    </div>

                    <div className="keyboard">
                        
                        <textarea 
                            placeholder="Hello"
                            value={this.state.message} 
                            onChange={this.onMessageChange}  />

                        <button onClick={this.sendMessage}>Send</button>

                    </div>

                </div>

            </div>
        );
    }

}

export default Chat;