import React from 'react';
import './Chat.css';

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeChatUsername: "",
            conversation: [],
            message: ""
        };

        this.getConversation = this.getConversation.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
    }

    componentDidMount() {

        if(this.state.activeChatUsername !== this.props.activeChatUsername) {
            this.setState({
                activeChatUsername: this.props.activeChatUsername
            }, 
                ()=>{this.getConversation()}
            );
        }

    }

    componentDidUpdate() {

        if(this.state.activeChatUsername !== this.props.activeChatUsername) {
            this.setState({
                activeChatUsername: this.props.activeChatUsername
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
                body: JSON.stringify({body:this.props.activeChatUsername}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    this.setState({
                        conversation: res.body
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async sendMessage() {

        var url = "http://localhost:8082/messenger/message"

        var body = {
            "receiverUsername": this.props.activeChatUsername,
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
                document.getElementById("")
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

        if(this.props.activeChatUsername !== "") {
            
            conversation = "Write a message to " + this.props.activeChatUsername + "!";
            
        }

        if(this.state.conversation.length > 0) {

            conversation = [];

            this.state.conversation.forEach((message, index) => {

                var receiveOrSendCss = "sended";
                if(message.senderUsername !== "") {
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
                    <p>{this.props.activeChatUsername}</p>
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