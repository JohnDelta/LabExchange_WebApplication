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
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-users" />
                    </button>
                    <p>John</p>
                </div>

                <div className="container">

                    <div className="chat">
                        
                        <div className="message-body received">
                            <div className="message received">
                                Ela man o mixalhs eimai
                            </div>
                            <div className="info">
                                Received 20 Hours ago
                            </div>
                        </div>

                        <div className="message-body sended">
                            <div className="message sended">
                                poios?
                            </div>
                            <div className="info">
                                Received 20 Hours ago
                            </div>
                        </div>

                        <div className="message-body received">
                            <div className="message received">
                                apo ti PASP eimaste theleis tpt shmeiwsoules?
                            </div>
                            <div className="info">
                                Received 20 Hours ago
                            </div>
                        </div>

                    </div>

                    <div className="keyboard">
                        
                        <textarea defaultValue="message"  />

                        <button>Send</button>

                    </div>

                </div>

            </div>
        );
    }

}

export default Chat;