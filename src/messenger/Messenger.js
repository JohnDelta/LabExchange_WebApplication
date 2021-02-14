import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Navbar from '../UIComponents/Navbar.js';
import PanelTitle from '../UIComponents/PanelTitle';

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

                <Navbar />

                <div className="Messenger">

                    <PanelTitle 
                        links={["messenger"]} 
                        linksName={["Messenger"]}
                        backLink={""} 
                    />

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
        );
    }

}

export default Messenger;