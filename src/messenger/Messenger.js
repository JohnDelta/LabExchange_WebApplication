import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Authentication from '../authentication/Authentication';

class Messenger extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            "showChats": false
        };
    
        this.toggleChats = this.toggleChats.bind(this);
    }

    toggleChats() {
        this.setState({
            showChats: !this.state.showChats
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

                <Chats toggleChats={this.toggleChats} showChats={this.state.showChats} />

                <Chat toggleChats={this.toggleChats} />

            </div>
        );
    }

}

export default Messenger;