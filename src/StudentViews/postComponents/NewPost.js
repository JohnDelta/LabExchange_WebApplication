import React from 'react';
import './NewPost.css';
import Header from '../../UIComponents/Header';
import BasicModels from '../../Tools/BasicModels';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

import {
    Link
 } from "react-router-dom";

class NewPost extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "labClassId": this.props.match.params.link.split("-")[1],
            "labClassesAndLabs": [],
            "providedLab": "",
            "labs": [],
            "message": ""
        };
        this.loadUserClasses = this.loadUserClasses.bind(this);
        this.loadUserLab = this.loadUserLab.bind(this);
        this.loadLabClassLabs = this.loadLabClassLabs.bind(this);
        this.createPost = this.createPost.bind(this);
        this.remountHeaderFromPost = this.remountHeaderFromPost.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadUserClasses();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNone());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromPost() {
        this.setState({
            remountHeaderValue: Math.random()
        });
      }

    async loadUserClasses() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/classes/student/get/by/me";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labClassesAndLabs: sucess.body
            }, () => {
                this.loadUserLab();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async loadUserLab() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/classes/student/get/lab/by/me";

        var labClassObject = BasicModels.getLabClassModel();
        var el = document.getElementById("labClassDropdown");
        labClassObject.labClassId = el.value;
        var jsonBody = JSON.stringify({body:labClassObject});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                providedLab: sucess.body
            }, () => {
                if (this.state.labClassId !== "" && typeof this.state.labClassId !== "undefined") {
                    el.value = this.state.labClassId;
                }
                this.loadLabClassLabs();
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async loadLabClassLabs() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/classes/student/get/labs/by/class";

        var labClassObject = BasicModels.getLabClassModel();
        var el = document.getElementById("labClassDropdown");
        labClassObject.labClassId = el.value;
        var jsonBody = JSON.stringify({body:labClassObject});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labs: sucess.body
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async createPost() {
        
        let readyToSend = true;

        var labClassDropdown = document.getElementById("labClassDropdown");
        var labDropdown = document.getElementById("requestedLabDropdown");

        if (labClassDropdown.value === "-1" || labDropdown.value === "-1" || this.state.providedLab === "" || typeof this.state.providedLab === "undefined") {
            readyToSend = false;
        }

        if(readyToSend) {
    
            let post = BasicModels.getPostModel();
            post.providedLab.labId = this.state.providedLab.labId;
            post.requestedLab.labId = labDropdown.value;
            post.labClass.labClassId = labClassDropdown.value;
            let jsonBody = JSON.stringify({body:post});
    
            var url = ServiceHosts.getClassesHost()+"/posts/new";
    
            SharedMethods.authPost(url, jsonBody, (sucess) => {
                this.setState({
                    message: "Post created!"
                });
            }, (err) => {Authentication.logout(this.props.history);});

        }

    }

    render() {

        let backLink = "/student/" + this.props.match.params.link.replace("-", "/");

        let labClassOptions = this.state.labClassesAndLabs.map((labClassAndLab, index) => {
            return (
                <option value={labClassAndLab.labClass.labClassId} key={"labclassoptions_"+labClassAndLab.labClass.labClassId+index} >{labClassAndLab.labClass.name}</option>
            );
        });

        labClassOptions = labClassOptions.length > 0 ? labClassOptions : <option value="-1">No Classes</option>;

        let title = "New post";

        let labClassAndLab = this.state.labClassesAndLabs.filter(labClassAndLab => labClassAndLab.labClass.labClassId === this.state.labClassId);
    
        title += (labClassAndLab.length > 0 ? (": " + labClassAndLab[0].labClass.name) : "");

        let labOptions = this.state.labs.map((lab, index) => {
            if (lab.labId !== this.state.providedLab.labId) {
                return (
                    <option key={"labs_"+lab.labId+index} value={lab.labId}>{lab.name}</option>
                );
            } else return null;
        });
        
        labOptions = labOptions.length > 0 ? labOptions : <option value="-1">No labs for this class</option>;

        return (
            <div className="NewPostWrapper">
                <div className="NewPost">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromPost} 
                        key={this.state.remountHeaderValue} />

                    <div className="NewPost-container">
                        <div className="NewPost-header">
                            <div className="NewPost-title">{title}</div>
                            <Link className="NewPost-back" to={backLink}>
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="NewPost-body">
                            
                            <div className="row">
                                <p className="text">{this.state.message}</p>
                            </div>

                            <div className="row">
                                <p className="text">Post for Class</p>
                                <i className="fa fa-angle-right" />
                                <select className="dropdown" id="labClassDropdown" onChange={this.loadUserLab} >
                                    {labClassOptions}
                                </select>
                            </div>

                            <div className="row">
                                <p className="text">My Assigend Lab</p>
                                <i className="fa fa-angle-right" />
                                <p className="text">{(this.state.providedLab !== "" ? this.state.providedLab.name : "No lab found")}</p>
                            </div>

                            <div className="row">
                                <p className="text">Looking for Lab</p>
                                <i className="fa fa-angle-right" />
                                <select className="dropdown" id="requestedLabDropdown" >
                                    {labOptions}
                                </select>
                            </div>

                            <div className="row">
                                <button onClick={this.createPost}>Create</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
          );
    }

}

export default NewPost;