import React from 'react';
import './Chats.css';

class Chats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var showChatsCss = "";

        if(this.props.showChats) {
            showChatsCss = "showPanelFromLeft";
        }

        return(
            <div className={"Chats hidePanelToLeft " + showChatsCss}>

                <div className="title">
                    <p>Conversations</p>
                    <button onClick={this.props.toggleChats} >
                        <i className="fa fa-times-circle" />
                    </button>
                </div>

                <div className="container">

                    <div className="chat">
                        <div className="title">
                            Mike
                        </div>
                        <div className="message">
                            Ela man o mixalhs eima sdfgds dfgds dsfg sdfsdf sdf d
                        </div>
                        <div className="info">
                            Received 20 Hours ago
                        </div>
                    </div>

                </div>

            </div>
        );
    }

}

export default Chats;