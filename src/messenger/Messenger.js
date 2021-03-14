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
            "activeChatroom": null
        };
    
        this.toggleChats = this.toggleChats.bind(this);
        this.activeChatSet = this.activeChatSet.bind(this);
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
        });
    }

    activeChatSet(chatroom) {
        this.setState({
            activeChatroom: chatroom
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
                            activeChatSet={this.activeChatSet} />

                        <Chat 
                            toggleChats={this.toggleChats} 
                            activeChatroom={this.state.activeChatroom} />
                    </div>

                </div>
            </div>
        );
    }

}

export default Messenger;