import React from 'react';
import './Messenger.css';
import Chat from './Chat';
import Chats from './Chats';

class Messenger extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="Messenger">

                <Chats />

                <Chat />

            </div>
        );
    }

}

export default Messenger;