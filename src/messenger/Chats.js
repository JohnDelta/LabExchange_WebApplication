import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Chats.css';

class Chats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            conversations: [],
            conversationsInfoQueue: "",
            client: null,
            othersUsernameFromUrl: ""
        };

        this.getConversations = this.getConversations.bind(this);
        this.getConversationsInfoQueue = this.getConversationsInfoQueue.bind(this);
        this.subscribeToConversationsInfoQueue = this.subscribeToConversationsInfoQueue.bind(this);
        this.subscribeToConversationsInfoQueueCallback = this.subscribeToConversationsInfoQueueCallback.bind(this);
        this.disconnectFromQueue = this.disconnectFromQueue.bind(this);
        this.activeChat = this.activeChat.bind(this);
        this.onChatClick = this.onChatClick.bind(this);
    }

    componentDidMount() {
        this.getConversations();
    }

    componentWillUnmount() {
        this.disconnectFromQueue();
    }

    componentDidUpdate() {
        if (this.state.othersUsernameFromUrl !== this.props.match.params.username) {
            this.setState({
                othersUsernameFromUrl: this.props.match.params.username
            });
        }
    }

    async getConversations() {

        var url = "http://localhost:8082/messenger/conversations"

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
                        conversations: res.body
                    }, ()=> {
                        this.getConversationsInfoQueue();
                        this.activeChat();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async getConversationsInfoQueue() {

        var url = "http://localhost:8082/messenger/get-conversations-info-queue"

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
                        conversationsInfoQueue: res.body
                    }, () => {
                        this.subscribeToConversationsInfoQueue();
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async subscribeToConversationsInfoQueue() {

        var ws = new SockJS('http://localhost:8082/ws');
        var client = Stomp.over(ws);

        var headers = {
          "login": "guest",
          "passcode": "guest",
          'X-Authorization': localStorage.getItem("jwt")
        };

        if (this.state.conversationsInfoQueue !== "") {

            client.connect(
                headers, 
                () => {

                    var subscription = client.subscribe(
                        "/queue/" + this.state.conversationsInfoQueue, 
                        this.subscribeToConversationsInfoQueueCallback,
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

    subscribeToConversationsInfoQueueCallback(object) {

        var othersUsername = object.body;

        if(othersUsername !== this.props.activeOthersUsername) {
            this.getConversations();
        }

    }

    disconnectFromQueue() {

        if(this.state.client !== null && typeof this.state.client !== "undefined") {
            this.state.client.disconnect(()=>{
                console.log("disconected");
            });    
        }

    }

    activeChat() {

        // sets the active conversation from url's username parameter

        var conversationIndex = this.state.conversations.filter((conversation, index) => {
            if (conversation.othersQueue.senderUsername === this.state.othersUsernameFromUrl) {
                return index;
            }
        });
        conversationIndex = (conversationIndex * 1) < 0 ? 0 : conversationIndex;
        
        var conversations = this.state.conversations;

        var chatroom = conversations[conversationIndex];

        chatroom.received = true;

        var myQueue = chatroom.myQueue.queue;
        var othersQueue = chatroom.othersQueue.queue;
        var othersUsername = chatroom.othersQueue.senderUsername;

        this.setState({
            conversations: conversations
        });

        this.props.activeChatSet(myQueue, othersQueue, othersUsername);

    }

    onChatClick(e) {

        var othersUsername = e.target.id.split("_")[1];
        this.props.history.push("/messenger/"+othersUsername);

        this.activeChat();

    }

    render() {

        var showChatsCss = (this.props.showChats) ? "" : "showPanelFromLeft";

        var chats = this.state.conversations.map((conversation, index) => {

            var newMessagesIcon = (!conversation.received) ? "" : <i className="fa fa-comment" />;
            
            return (
                <div className="chat" key={"chats_index"+index}>
                    <div className="title" 
                        id={"conversations_"+conversation.othersQueue.senderUsername}
                        onClick={this.onChatClick}>
                            {conversation.othersQueue.senderUsername}
                            {newMessagesIcon}
                    </div>
                </div>
            );
        });

        chats = (chats.length > 0) ? chats : "No chats active";

        var chats = "No chats active";

        return(
            <div className={"Chats hidePanelToLeft " + showChatsCss}>

                <div className="title">
                    <p>Conversations</p>
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

export default Chats;