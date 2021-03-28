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
            "lab": BasicModels.getLabModel(),
            "labStudents": []
        };

        this.loadLab = this.loadLab.bind(this);
        this.remountHeaderFromLab = this.remountHeaderFromLab.bind(this);
        this.loadLabStudents = this.loadLabStudents.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadLab();
        this.loadLabStudents();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNone());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromLab() {
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

    async loadLabStudents() {

        if (!this._isMounted) {return;}

        let id = this.props.match.params.id;
        var url = ServiceHosts.getClassesHost()+"/classes/professor/get/lab/students/by/me";

        var labObject = BasicModels.getLabModel();
        labObject.labId = id;
        var jsonBody = JSON.stringify({body:labObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labStudents: sucess.body
            });
        }, (error) => {Authentication.logout(this.props.history);});

    }

    render() {

        var users = this.state.labStudents.map((user) => {
            return (
                <div className="tile" id={"tile_"+user.userId} key={"class_tile_key"+user.userId}>
                    <div className="tile-header">{user.name + " " + user.lastname + "(" + user.username + ")"}</div>
                </div>
            );
        });

        users = users.length > 0 ? users : "There aren't any users assigned in this lab yet.";

        let backLink = "/professor/class/" + this.props.match.params.link.replace("-", "/");

        return (
            <div className="ClassWrapper">
                <div className="ProfessorLab">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromLab} 
                        key={this.state.remountHeaderValue} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.lab.name}</div>
                            <Link className="class-back" to={backLink}>
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="tiles">
                        {users}
                    </div>

                </div>
            </div>
          );
    }

}

export default ProfessorLab;