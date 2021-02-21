import React from 'react';
import './NewPost.css';
import Header from '../UIComponents/Header.js';

import {
    Link
 } from "react-router-dom";

class NewPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "labId": this.props.match.params.link.split("-")[1] 
        };
    }

    render() {

        let backLink = "/" + this.props.match.params.link.replace("-", "/");

        return (
            <div className="NewPostWrapper">
                <div className="NewPost">

                    <Header activeTab={"class"} history={this.props.history} />

                    <div className="NewPost-container">
                        <div className="NewPost-header">
                            <div className="NewPost-title">New Post (for class {(this.state.labId !== "") ? this.state.labId : "" })</div>
                            <Link className="NewPost-back" to={backLink}>
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="NewPost-body">
                            
                            <div className="row">
                                <p className="text">Post for Class</p>
                                <i className="fa fa-angle-right" />
                                <select className="dropdown">
                                    <option>C++</option>
                                </select>
                            </div>

                            <div className="row">
                                <p className="text">My Assigend Lab</p>
                                <i className="fa fa-angle-right" />
                                <select className="dropdown">
                                    <option>C++</option>
                                </select>
                            </div>

                            <div className="row">
                                <p className="text">Looking for Lab</p>
                                <i className="fa fa-angle-right" />
                                <select className="dropdown">
                                    <option>C++</option>
                                </select>
                            </div>

                            <div className="row">
                                <button>Create</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
          );
    }

}

export default NewPost;