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
            "activeChatGet": {
                "activeChatOthersUsername": "",
                "activeChatMyQueue": "",
                "activeChatOthersQueue": ""
            }
        };
    
        this.toggleChats = this.toggleChats.bind(this);
        this.activeChatSet = this.activeChatSet.bind(this);
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
        });
    }

    activeChatSet(myQueue, othersQueue, othersUsername) {
        this.setState({
            activeChatGet: {
                activeChatOthersUsername: othersUsername,
                activeChatMyQueue: myQueue,
                activeChatOthersQueue: othersQueue
            }
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
                            activeChatGet={this.state.activeChatGet} />
                    </div>

                </div>
            </div>
        );
    }

}

export default Messenger;