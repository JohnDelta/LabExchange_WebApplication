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
            "labClassAndLab": {
                "labClass": {
                    "labClassId": 0,
                    "name": "",
                    "openForRegistrations": false
                },
                "lab": {
                    "labId": 0,
                    "name": "",
                    "labClass": {}
                }
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

    async loadClass() {

        let id = this.props.match.params.id;

        var url = "http://localhost:8083/classes/myClassAndLab/get"

        var labClassObject = {
            "labClassId": id,
            "name": "",
            "openForRegistrations": false
        };

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:labClassObject}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200 && res.body !== null) {
                        this.setState({
                            labClassAndLab: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    render() {

        var posts = this.state.posts.map((post) => {

            let applyButtonCss = (post.requestedLab !== this.state.labClassAndLab.lab.name &&
                post.requestedLab !== "" && post.assignedLab === this.state.labClassAndLab.lab.name) ? "inactiveButton" : "";

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
                            <div className="tile-info-body">{(post.requestedLab === "") ? ("Any choice") : post.requestedLab }</div>
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
                            <div className="class-title">{this.state.labClassAndLab.labClass.name}</div>
                            <Link className="class-back" to="/classes">
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="class-body">
                            <div className="class-info">
                                <div className="class-info-header">Assigned Lab : {this.state.labClassAndLab.labClass.labClassId}</div>
                                <div className="class-info-body">{this.state.labClassAndLab.lab.name}</div>
                            </div>
                            <div className="class-info">
                                <div className="class-info-header">Open for registrations</div>
                                <div className="class-info-body">{this.state.labClassAndLab.labClass.openForRegistrations}</div>
                            </div>
                            <div className="class-buttons">
                                <Link to={"/post/new/class-"+this.state.labClassAndLab.labClass.labClassId}>
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