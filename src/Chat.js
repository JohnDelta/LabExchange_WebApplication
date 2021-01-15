import React from 'react';
import './Chat.css';

class Chat extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="Chat">

                <div className="title">
                    <p>John</p>
                </div>

                <div className="container">

                    <div className="chat">
                        chat here
                    </div>

                    <div className="keyboard">
                        keyboard here
                    </div>

                </div>

            </div>
        );
    }

}

export default Chat;