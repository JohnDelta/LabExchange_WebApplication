import React from 'react';
import './Class.css';
import Header from '../UIComponents/Header.js';

import {
    Link
 } from "react-router-dom";

class Class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "class": {
                "classId": 0,
                "title": "Object Oriented Programming (CTE-0010)",
                "assignedLab": "TR1 (Thurday 14:00-15:00)",
                "isOpen": true
            },
            "posts": [
                {
                    "postId": 0,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                    "hasApplied": false
                },
                {
                    "postId": 1,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "TR2 (Thurday 15:00-16:00)",
                    "hasApplied": false
                },
                {
                    "postId": 2,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                    "hasApplied": false
                },
                {
                    "postId": 3,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR3 (Thurday 14:00-15:00)",
                    "requestedLab": "TR4 (Thurday 15:00-16:00)",
                    "hasApplied": false
                },
            ]
        };

        this.loadClass = this.loadClass.bind(this);
    }

    componentDidMount() {
        
        this.loadClass();

    }

    loadClass() {

        let id = this.props.match.params.id;

        // fetch class data here later

        let classToLoad = this.state.class;
        classToLoad.classId = id;

        this.setState({
            "class": classToLoad
        });

    }

    render() {

        var posts = this.state.posts.map((post) => {

            let applyButtonCss = (post.requestedLab !== this.state.class.assignedLab &&
                post.requestedLab !== "" && post.assignedLab === this.state.class.assignedLab) ? "inactiveButton" : "";

            return (
                <div className="tile" id={post.postId} key={"class_tile_key"+post.postId}>
                    <div className="tile-header">{post.title}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{post.assignedLab}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{post.requestedLab}</div>
                        </div>
                        <div className="tile-buttons">
                            <button>Message</button>
                            <button className={applyButtonCss} >Apply</button>
                        </div>
                    </div>
                </div>
            );
        })

        return (
            <div className="ClassWrapper">
                <div className="Class">

                    <Header activeTab={"class"} history={this.props.history} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.class.title}</div>
                            <Link className="class-back" to="/classes">
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="class-body">
                            <div className="class-info">
                                <div className="class-info-header">Assigned Lab : {this.state.class.classId}</div>
                                <div className="class-info-body">{this.state.class.assignedLab}</div>
                            </div>
                            <div className="class-info">
                                <div className="class-info-header">Open for registrations</div>
                                <div className="class-info-body">{this.state.class.isOpen}</div>
                            </div>
                            <div className="class-buttons">
                                <Link to={"/post/new/class-"+this.state.class.classId}>
                                    <i className="fa fa-plus" />
                                    <div>New Post</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tiles">
                        {posts}
                    </div>

                </div>
            </div>
          );
    }

}

export default Class;