import React from 'react';
import './Class.css';
import Header from '../UIComponents/Header.js';
import BasicModels from '../Models/BasicModels.js';

import {
    Link
 } from "react-router-dom";

class Class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "labClassAndLab": BasicModels.getLabClassAndLabModel(),
            "posts": []
        };

        this.loadClass = this.loadClass.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        this.applyToPost = this.applyToPost.bind(this);
    }

    componentDidMount() {
        
        this.loadClass();

    }

    async loadClass() {

        let id = this.props.match.params.id;

        var url = "http://localhost:8083/classes/get/class/by/me"

        var labClassObject = BasicModels.getLabClassModel();
        labClassObject.labClassId = id;

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
                        }, () => {
                            this.loadPosts();
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async loadPosts() {

        var url = "http://localhost:8083/posts/get/by/class"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:this.state.labClassAndLab.labClass}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200 && res.body !== null) {
                        this.setState({
                            posts: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async applyToPost(e) {

        var url = "http://localhost:8083/posts/applications/new";

        let postId = e.target.id;

        let post = BasicModels.getPostModel();
        post.postId = postId;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:post}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200) {
                        this.loadPosts();
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    render() {

        var postsWithoutMine = this.state.posts.filter((post) => post.username !== localStorage.getItem("username"));

        var postsWithoutTheApplied = postsWithoutMine.filter((post) => post.applications.filter(application => application.user.username !== localStorage.getItem("username")));

        var posts = postsWithoutTheApplied.map((post) => {

            let applyButtonCss = (post.requestedLab !== this.state.labClassAndLab.lab.name &&
                post.requestedLab !== "" && post.assignedLab === this.state.labClassAndLab.lab.name) ? "inactiveButton" : "";

            return (
                <div className="tile" id={"tile_"+post.postId} key={"class_tile_key"+post.postId}>
                    <div className="tile-header">{post.username}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{post.providedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(post.requestedLab === "" || typeof post.requestedLab === "undefined") ? ("Any choice") : post.requestedLab.name }</div>
                        </div>
                        <div className="tile-buttons">
                            <button>Message</button>
                            <button className={applyButtonCss} onClick={this.applyToPost} id={post.postId} >Apply</button>
                        </div>
                    </div>
                </div>
            );
        });

        posts = posts.length > 0 ? posts : "There aren't any lab exchange posts for this class yet.";

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
                                <div className="class-info-header">Assigned Lab:</div>
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