import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';
import Authentication from '../authentication/Authentication';

class Messenger extends React.Component {

    constructor(props) {
        super(props);
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

                <Chats />

                <Chat />

            </div>
        );
    }

}

export default Messenger;