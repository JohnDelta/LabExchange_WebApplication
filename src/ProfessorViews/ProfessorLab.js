import React from 'react';
import './ProfessorLab.css';
import Header from '../UIComponents/Header';
import BasicModels from '../Tools/BasicModels';
import ServiceHosts from '../Tools/ServiceHosts';
import SharedMethods from '../Tools/SharedMethods';
import Authentication from '../authentication/Authentication';

import {
    Link
 } from "react-router-dom";

class ProfessorLab extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "lab": BasicModels.getLabModel()
        };

        this.loadLab = this.loadClass.bind(this);
        this.remountHeaderFromClass = this.remountHeaderFromClass.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadLab();
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

    async loadLab() {

        if (!this._isMounted) {return;}

        let id = this.props.match.params.id;
        var url = ServiceHosts.getClassesHost()+"/classes/professor/get/lab/by/me";

        var labObject = BasicModels.getLabModel();
        labObject.labId = id;
        var jsonBody = JSON.stringify({body:labObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                lab: sucess.body
            });
        }, (error) => {Authentication.logout(this.props.history);});

    }

    render() {

        // var postsWithoutMine = this.state.postsAndApplications.filter((postAndApplications) => postAndApplications.post.user.username !== localStorage.getItem("username"));
        // var postsWithoutMyApplied = [];
        // postsWithoutMine.forEach(postWithoutMine => {
        //     if (postWithoutMine.applications.length > 0) {
        //         postWithoutMine.applications.forEach(application => {
        //             if (application.user.username !== localStorage.getItem("username")) {
        //                 postsWithoutMyApplied.push(postWithoutMine);
        //             }
        //         });
        //     } else {
        //         postsWithoutMyApplied.push(postWithoutMine);
        //     }
        // });

        // var posts = postsWithoutMyApplied.map((postAndApplication) => {

        //     let applyButtonCss = (postAndApplication.post.requestedLab !== this.state.labClassAndLab.lab.name &&
        //         postAndApplication.post.requestedLab !== "" && postAndApplication.post.assignedLab === this.state.labClassAndLab.lab.name) ? "inactiveButton" : "";

        //     return (
        //         <div className="tile" id={"tile_"+postAndApplication.post.postId} key={"class_tile_key"+postAndApplication.post.postId}>
        //             <div className="tile-header">{postAndApplication.post.user.name + " " + postAndApplication.post.user.lastname}</div>
        //             <div className="tile-body">
        //                 <div className="tile-info">
        //                     <div className="tile-info-header">Exchanging</div>
        //                     <div className="tile-info-body">{postAndApplication.post.providedLab.name}</div>
        //                 </div>
        //                 <div className="tile-info">
        //                     <div className="tile-info-header">With</div>
        //                     <div className="tile-info-body">{(postAndApplication.post.requestedLab === "" || typeof postAndApplication.post.requestedLab === "undefined") ? ("Any choice") : postAndApplication.post.requestedLab.name }</div>
        //                 </div>
        //                 <div className="tile-buttons">
        //                     <button onClick={this.openChatroom} id={"class_openchatroom_"+postAndApplication.post.user.username}>Message</button>
        //                     <button className={applyButtonCss} onClick={this.applyToPost} id={postAndApplication.post.postId} >Apply</button>
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // });

        // posts = posts.length > 0 ? posts : "There aren't any lab exchange posts for this class yet.";

        let backLink = "/professor/" + this.props.match.params.link.replace("-", "/");

        return (
            <div className="ClassWrapper">
                <div className="ProfessorLab">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromClass} 
                        key={this.state.remountHeaderValue} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.labClassAndLab.labClass.name}</div>
                            <Link className="class-back" to={backLink}>
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
                        
                    </div>

                </div>
            </div>
          );
    }

}

export default ProfessorLab;