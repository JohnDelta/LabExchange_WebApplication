import React from 'react';
import './Lab.css';
import Header from '../UIComponents/Header.js';

import {
    Link
 } from "react-router-dom";

class Lab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "lab": {
                "labId": 0,
                "title": "Object Oriented Programming (CTE-0010)",
                "assignedLab": "TR1 (Thurday 14:00-15:00)",
                "isOpen": true
            },
            "posts": [
                {
                    "postId": 0,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": ""
                },
                {
                    "postId": 1,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "TR2 (Thurday 15:00-16:00)"
                },
                {
                    "postId": 2,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": ""
                },
                {
                    "postId": 3,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR3 (Thurday 14:00-15:00)",
                    "requestedLab": "TR4 (Thurday 15:00-16:00)"
                },
            ]
        };

        this.loadLab = this.loadLab.bind(this);
    }

    componentDidMount() {
        
        this.loadLab();

    }

    loadLab() {

        let id = this.props.match.params.id;

        // fetch lab data here later

        let lab = this.state.lab;
        lab.labId = id;

        this.setState({
            "lab": lab
        });

    }

    render() {

        var posts = this.state.posts.map((post) => {

            let applyButtonCss = (post.requestedLab !== this.state.lab.assignedLab &&
                post.requestedLab !== "" && post.assignedLab === this.state.lab.assignedLab) ? "inactiveButton" : "";

            return (
                <div className="tile" id={post.postId} key={"lab_tile_key"+post.postId}>
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
            <div className="LabWrapper">
                <div className="Lab">

                    <Header activeTab={"lab"} history={this.props.history} />

                    <div className="lab-container">
                        <div className="lab-header">
                            <div className="lab-title">{this.state.lab.title}</div>
                            <Link className="lab-back" to="/labs">
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="lab-body">
                            <div className="lab-info">
                                <div className="lab-info-header">Assigned Lab : {this.state.lab.labId}</div>
                                <div className="lab-info-body">{this.state.lab.assignedLab}</div>
                            </div>
                            <div className="lab-info">
                                <div className="lab-info-header">Open for registrations</div>
                                <div className="lab-info-body">{this.state.lab.isOpen}</div>
                            </div>
                            <div className="lab-buttons">
                                <button>
                                    <i className="fa fa-plus" />
                                    <div>New Post</div>
                                </button>
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

export default Lab;