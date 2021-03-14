import React from 'react';
import './NewPost.css';
import Header from '../UIComponents/Header.js';
import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';

import {
    Link
 } from "react-router-dom";

class NewPost extends React.Component {

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
    }

    componentDidMount() {

        this.loadUserClasses();

    }

    async loadUserClasses() {

        var url = ServiceHosts.getClassesHost()+"/classes/get/by/me";

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:""}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200) {
                        this.setState({
                            labClassesAndLabs: res.body
                        }, () => {
                            this.loadUserLab();
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async loadUserLab() {

        var url = ServiceHosts.getClassesHost()+"/classes/get/lab/by/me";

        var labClassObject = BasicModels.getLabClassModel();
        var el = document.getElementById("labClassDropdown");
        labClassObject.labClassId = el.value;

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

                    if(res.status === 200) {
                        this.setState({
                            providedLab: res.body
                        }, () => {
                            if (this.state.labClassId !== "" && typeof this.state.labClassId !== "undefined") {
                                el.value = this.state.labClassId;
                            }
                            this.loadLabClassLabs();
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async loadLabClassLabs() {

        var url = ServiceHosts.getClassesHost()+"/classes/get/labs/by/class";

        var labClassObject = BasicModels.getLabClassModel();
        var el = document.getElementById("labClassDropdown");
        labClassObject.labClassId = el.value;

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

                    if(res.status === 200) {
                        this.setState({
                            labs: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

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
    
            var url = ServiceHosts.getClassesHost()+"/posts/new";
    
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
                            this.setState({
                                message: "Post created!"
                            });
                        }
    
                    });
                
                } else {}
    
            } catch (error) {console.log(error);}

        }

    }

    render() {

        let backLink = "/" + this.props.match.params.link.replace("-", "/");

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

                    <Header activeTab={"class"} history={this.props.history} />

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