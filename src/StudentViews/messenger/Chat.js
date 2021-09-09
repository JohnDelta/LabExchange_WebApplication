import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import BasicModels from '../../Tools/BasicModels';
import './Chat.css';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

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
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.chatFilter = this.chatFilter.bind(this);
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

        var url = ServiceHosts.getMessengerHost()+"/messenger/student/conversation";
        
        var jsonBody = JSON.stringify({body:this.state.activeChatroom});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                conversation: sucess.body
            }, () => {
                this.chatFilter();
                if (this.state.conversationQueue === "") {
                    this.getConversationQueue();
                }
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async getConversationQueue() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getNotificationsHost()+"/notifications/get/conversation-queue";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                conversationQueue: sucess.body.queue
            }, () => {
                this.subscribeToConversationQueue();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async subscribeToConversationQueue() {

        if (typeof this.state.conversationQueue === "undefined" || this.state.conversationQueue === "" || this.state.conversationQueue === null) {
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
        if(this.state.client !== null && typeof this.state.client !== "undefined") {
            this.state.client.disconnect(()=>{
                //console.log("disconected");
            });    
        }
    }

    async sendMessage() {

        let url = ServiceHosts.getMessengerHost()+"/messenger/student/message";

        let body = BasicModels.getMessageModel();
        body.chatroom = this.state.activeChatroom;
        body.message = this.state.message;
        let jsonBody = JSON.stringify({body:body});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.getConversation();
            this.setState({
                message: ""
            });
        }, (err) => {Authentication.logout(this.props.history);});

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

    render() {

        var conversation = this.state.conversation.map((message, index) => {
            var receiveOrSendCss = (message.senderUser.username === localStorage.getItem("username")) ? "sended" : "received";
            return (
                <div className={"message-body "+receiveOrSendCss} key={"chat_conversation_"+index}>
                    <div className={"message "+receiveOrSendCss}>
                        {message.message}
                    </div>
                    <div className="info">
                        {SharedMethods.dateSince(message.timestamp)}
                    </div>
                </div>
            );
        });

        conversation = conversation.length > 0 ? conversation : "Say Hello!";
        let conversationTitle = "";

        if (typeof this.state.activeChatroom === "undefined" || this.state.activeChatroom === null || this.state.activeChatroom === "") {
            conversation = "Choose a conversation to send messages";
        } else {
            let chatroomName = this.state.activeChatroom.chatroomName.replace(localStorage.getItem("name"), "");
            chatroomName = chatroomName.replace(localStorage.getItem("lastname"), "");
            conversationTitle = chatroomName;
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