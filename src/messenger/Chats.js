import React from 'react';
import './Chats.css';

class Chats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            conversations: []
        };

        this.getConversations = this.getConversations.bind(this);
        this.activateChat = this.activateChat.bind(this);
    }

    componentDidMount() {

        this.getConversations();

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
                    });

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    activateChat(e) {
        var username = e.target.id.split("_")[1];
        this.props.activateChat(username);
    }

    render() {

        var showChatsCss = "";

        if(this.props.showChats) {
            showChatsCss = "showPanelFromLeft";
        }

        var chats = "No chats active";

        if(this.state.conversations.length > 0) {
            chats = [];
            this.state.conversations.forEach((conv, index) => {

                var otherUsername = conv.username1;
                if(conv.username2 !== "") {
                    otherUsername = conv.username2;
                }

                chats.push(
                    <div className="chat" key={"chats_index"+index}>
                        <div className="title" 
                            id={"conversations_"+otherUsername}
                            onClick={this.activateChat}>
                                {otherUsername}
                        </div>
                    </div>
                );
            });
        }

        /*
                    <div className="chat"> FOR LATER
                        <div className="title">
                            {conv.username1} - {conv.username2}
                        </div>
                        <div className="message">
                            Ela man o mixalhs eima sdfgds dfgds dsfg sdfsdf sdf d
                        </div>
                        <div className="info">
                            Received 20 Hours ago
                        </div>
                    </div>
        */

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