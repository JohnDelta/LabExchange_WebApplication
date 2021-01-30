import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Authentication from '../authentication/Authentication';

class Messenger extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            "showChats": false,
            "activeChatOthersUsername": "",
            "activeChatMyQueue": "",
            "activeChatOthersQueue": ""
        };
    
        this.toggleChats = this.toggleChats.bind(this);
        this.activateChat = this.activateChat.bind(this);
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
        });
    }

    activateChat(myQueue, othersQueue, othersUsername) {
        this.setState({
            activeChatOthersUsername: othersUsername,
            activeChatMyQueue: myQueue,
            activeChatOthersQueue: othersQueue
        });
    }

    render() {
        return(
            <div className="Messenger">

                <button
                    className="logout"
                    onClick={
                        () => {
                            Authentication.logout(()=>{
                                this.props.history.push("/");
                            })
                        }
                    } 
                >
                    Logout {localStorage.getItem("username")}</button>

                <Chats 
                    toggleChats={this.toggleChats} 
                    showChats={this.state.showChats} 
                    activateChat={this.activateChat} />

                <Chat 
                    toggleChats={this.toggleChats} 
                    activeChatOthersUsername={this.state.activeChatOthersUsername}
                    activeChatMyQueue={this.state.activeChatMyQueue}
                    activeChatOthersQueue={this.state.activeChatOthersQueue} />

            </div>
        );
    }

}

export default Messenger;