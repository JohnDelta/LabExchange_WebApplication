import React from 'react';
import './ProfessorClass.css';
import Header from '../UIComponents/Header';
import BasicModels from '../Tools/BasicModels';
import ServiceHosts from '../Tools/ServiceHosts';
import SharedMethods from '../Tools/SharedMethods';
import Authentication from '../authentication/Authentication';

import {
    Link
 } from "react-router-dom";

class ProfessorClass extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "labClassAndLabs": BasicModels.getLabClassAndLabsModel(),
            "postsAndApplications": []
        };

        this.loadClass = this.loadClass.bind(this);
        this.openLab = this.openLab.bind(this);
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
        var url = ServiceHosts.getClassesHost()+"/classes/professor/get/class/by/me";

        var labClassObject = BasicModels.getLabClassModel();
        labClassObject.labClassId = id;
        var jsonBody = JSON.stringify({body:labClassObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labClassAndLabs: sucess.body
            });
        }, (error) => {Authentication.logout(this.props.history);});

    }

    openLab(e) {
        e.preventDefault(false);
        var id = e.target.id;
        this.props.history.push("professor/lab/"+id);
    }

    render() {

        var labs = this.state.labClassAndLabs.labs.map((lab) => {
            return (
                <div 
                    className="tile cancelEvents" 
                    onClick={this.openClass} 
                    id={lab.labId} 
                    key={"classes_lab_"+lab.labId}
                    style={{"cursor":"pointer"}}
                >
                    <div className="tile-header">{lab.name}</div>
                    <div className="tile-body">
                    </div>
                </div>
            );
        });

        labs = labs.length > 0 ? labs : "There aren't any classes in your account yet.";

        return (
            <div className="ClassWrapper">
                <div className="ProfessorClass">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromClass} 
                        key={this.state.remountHeaderValue} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.labClassAndLabs.labClass.name}</div>
                            <Link className="class-back" to="professor/classes">
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="class-body">
                            <div className="class-info">
                                <div className="class-info-header">Open for registrations</div>
                                <div className="class-info-body">{this.state.labClassAndLab.labClass.openForRegistrations}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tiles">
                        {labs}
                    </div>

                </div>
            </div>
          );
    }

}

export default ProfessorClass;