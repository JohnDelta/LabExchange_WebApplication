import React from 'react';
import './Class.css';
import Header from '../../UIComponents/Header';
import BasicModels from '../../Tools/BasicModels';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

import {
    Link
 } from "react-router-dom";

class Class extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "labClassAndLab": BasicModels.getLabClassAndLabModel(),
            "postsAndApplications": []
        };

        this.loadClass = this.loadClass.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        this.applyToPost = this.applyToPost.bind(this);
        this.openChatroom = this.openChatroom.bind(this);
        this.remountHeaderFromClass = this.remountHeaderFromClass.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadClass();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNone());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromClass() {
        this.setState({
            remountHeaderValue: Math.random()
        });
      }

    async loadClass() {

        if (!this._isMounted) {return;}

        let id = this.props.match.params.id;
        var url = ServiceHosts.getClassesHost()+"/classes/get/class/by/me";

        var labClassObject = BasicModels.getLabClassModel();
        labClassObject.labClassId = id;
        var jsonBody = JSON.stringify({body:labClassObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labClassAndLab: sucess.body
            }, () => {
                this.loadPosts();
            });
        }, (error) => {Authentication.logout(this.props.history);});

    }

    async loadPosts() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/get/by/class";
        var jsonBody = JSON.stringify({body:this.state.labClassAndLab.labClass});
        
        SharedMethods.authPost(url, jsonBody, (sucess)=>{
            this.setState({
                postsAndApplications: sucess.body
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async applyToPost(e) {

        var url = ServiceHosts.getClassesHost()+"/posts/applications/new";

        let postId = e.target.id;
        let post = BasicModels.getPostModel();
        post.postId = postId;
        let jsonBody = JSON.stringify({body:post}); 

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.loadPosts();
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async openChatroom(e) {
        var othersUsername = e.target.id.split("_")[2];
        this.props.history.push("student/messenger/user/" + othersUsername);
    }

    render() {

        var postsWithoutMine = this.state.postsAndApplications.filter((postAndApplications) => postAndApplications.post.user.username !== localStorage.getItem("username"));
        var postsWithoutMyApplied = [];
        postsWithoutMine.forEach(postWithoutMine => {
            if (postWithoutMine.applications.length > 0) {
                postWithoutMine.applications.forEach(application => {
                    if (application.user.username !== localStorage.getItem("username")) {
                        postsWithoutMyApplied.push(postWithoutMine);
                    }
                });
            } else {
                postsWithoutMyApplied.push(postWithoutMine);
            }
        });

        var posts = postsWithoutMyApplied.map((postAndApplication) => {

            let applyButtonCss = (postAndApplication.post.requestedLab !== this.state.labClassAndLab.lab.name &&
                postAndApplication.post.requestedLab !== "" && postAndApplication.post.assignedLab === this.state.labClassAndLab.lab.name) ? "inactiveButton" : "";

            return (
                <div className="tile" id={"tile_"+postAndApplication.post.postId} key={"class_tile_key"+postAndApplication.post.postId}>
                    <div className="tile-header">{postAndApplication.post.user.name + " " + postAndApplication.post.user.lastname}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{postAndApplication.post.providedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(postAndApplication.post.requestedLab === "" || typeof postAndApplication.post.requestedLab === "undefined") ? ("Any choice") : postAndApplication.post.requestedLab.name }</div>
                        </div>
                        <div className="tile-buttons">
                            <button onClick={this.openChatroom} id={"class_openchatroom_"+postAndApplication.post.user.username}>Message</button>
                            <button className={applyButtonCss} onClick={this.applyToPost} id={postAndApplication.post.postId} >Apply</button>
                        </div>
                    </div>
                </div>
            );
        });

        posts = posts.length > 0 ? posts : "There aren't any lab exchange posts for this class yet.";

        return (
            <div className="ClassWrapper">
                <div className="Class">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromClass} 
                        key={this.state.remountHeaderValue} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.labClassAndLab.labClass.name}</div>
                            <Link className="class-back" to="/student/classes">
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
                                <Link to={"/student/post/new/class-"+this.state.labClassAndLab.labClass.labClassId}>
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