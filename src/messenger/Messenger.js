import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Header from '../UIComponents/Header.js';

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
            <div className="MessengerWrapper">
                <div className="Messenger">

                    <Header activeTab={"messenger"} history={this.props.history} />

                    <div className="messenger-content">
                        <Chats 
                            toggleChats={this.toggleChats} 
                            showChats={this.state.showChats} 
                            activateChat={this.activateChat}
                            activeChatOthersUsername={this.state.activeChatOthersUsername} />

                        <Chat 
                            toggleChats={this.toggleChats} 
                            activeChatOthersUsername={this.state.activeChatOthersUsername}
                            activeChatMyQueue={this.state.activeChatMyQueue}
                            activeChatOthersQueue={this.state.activeChatOthersQueue} />
                    </div>

                </div>
            </div>
        );
    }

}

export default Messenger;