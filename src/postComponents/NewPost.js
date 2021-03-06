import React from 'react';
import './NewPost.css';
import Header from '../UIComponents/Header.js';
import BasicModels from '../Models/BasicModels.js';

import {
    Link
 } from "react-router-dom";

class NewPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "labClassId": this.props.match.params.link.split("-")[1],
            "labClassesAndLabs": [],
            "providedLab": ""
        };
        this.loadUserClasses = this.loadUserClasses.bind(this);
        this.loadUserLab = this.loadUserLab.bind(this);
    }

    componentDidMount() {

        this.loadUserClasses();

    }

    async loadUserClasses() {

        var url = "http://localhost:8083/classes/get/by/me";

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

        var url = "http://localhost:8083/classes/get/lab/by/me";

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
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    render() {

        let backLink = "/" + this.props.match.params.link.replace("-", "/");

        let labClassOptions = this.state.labClassesAndLabs.map((labClassAndLab, index) => {
            return (
                <option value={labClassAndLab.labClass.labClassId} key={"labclassoptions_"+labClassAndLab.labClass.labClassId+index} >{labClassAndLab.labClass.name}</option>
            );
        });

        labClassOptions = labClassOptions.length > 0 ? labClassOptions : <option>No Classes</option>;

        let title = "New post";

        let labClassAndLab = this.state.labClassesAndLabs.filter(labClassAndLab => labClassAndLab.labClass.labClassId === this.state.labClassId);
    
        title += (labClassAndLab.length > 0 ? (": " + labClassAndLab[0].labClass.name) : "");

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