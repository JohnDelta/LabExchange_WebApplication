import React from 'react';
import './Header.css';
import Authentication from '../authentication/Authentication';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(e) {
        
        let elements = document.getElementsByClassName("tab");
        for(let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active-tab");
        }
        e.target.classList.add("active-tab");

        this.props.history.push(e.target.id.split("_")[0]);
        
    }

    render() {
        return (
            <div className="Header">
                <div className="Header-body-wrapper">

                    <div className="upper">
                        <div className="title">
                            <span>LabExchange</span>
                        </div>

                        <a className="link" onClick={() => {Authentication.logout();}} >
                            <i className="fa fa-sign-out"></i>
                            <span>Exit</span>
                        </a>
                    </div>

                    <div className="lower">

                        <button
                            className={"tab " + ((this.props.activeTab === "class") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/classes_0">Classes</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "my-posts") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/post/my-posts_1">My Posts</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "applications") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/post/applications_2">Applications</button>

                        <button
                            className={"tab " + ((this.props.activeTab === "messenger") ? "active-tab" : "")} 
                            onClick={this.onTabClick} 
                            id="/messenger_3">Chat</button>

                    </div>

                </div>
            </div>
        );
    }
}

export default Header;