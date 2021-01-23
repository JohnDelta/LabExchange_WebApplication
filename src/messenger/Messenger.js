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
            "activeChatUsername": ""
        };
    
        this.toggleChats = this.toggleChats.bind(this);
        this.activateChat = this.activateChat.bind(this);
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
        });
    }

    activateChat(username) {
        this.setState({
            activeChatUsername: username
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
                    Logout</button>

                <Chats 
                    toggleChats={this.toggleChats} 
                    showChats={this.state.showChats} 
                    activateChat={this.activateChat} />

                <Chat 
                    toggleChats={this.toggleChats} 
                    activeChatUsername={this.state.activeChatUsername} />

            </div>
        );
    }

}

export default Messenger;