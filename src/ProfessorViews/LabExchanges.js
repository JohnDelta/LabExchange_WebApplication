import React from 'react';
import './LabExchanges.css';
import Header from '../UIComponents/Header';
import BasicModels from '../Tools/BasicModels';
import ServiceHosts from '../Tools/ServiceHosts';
import SharedMethods from '../Tools/SharedMethods';
import Authentication from '../authentication/Authentication';

import {
    Link
 } from "react-router-dom";

class LabExchanges extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "labClassAndLabs": BasicModels.getLabClassAndLabsModel(),
            "labExchanges": []
        };

        this.getFullTime = this.getFullTime.bind(this);
        this.loadLabExchanges = this.loadLabExchanges.bind(this);
        this.loadClass = this.loadClass.bind(this);
        this.remountHeaderFromLabExchanges = this.remountHeaderFromLabExchanges.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadClass();
        this.loadLabExchanges();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNone());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromLabExchanges() {
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

    async loadLabExchanges() {

        if (!this._isMounted) {return;}

        let id = this.props.match.params.id;
        var url = ServiceHosts.getClassesHost()+"/posts/lab-exchanges/get/by/class";

        var labClassObject = BasicModels.getLabClassModel();
        labClassObject.labClassId = id;
        var jsonBody = JSON.stringify({body:labClassObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labExchanges: sucess.body
            });
        }, (error) => {Authentication.logout(this.props.history);});

    }

    getFullTime(timeInMillis) {
        var currentdate = new Date(timeInMillis); 
        var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        return datetime;
    }

    render() {

        var labExchanges = this.state.labExchanges.map((application, index) => {
            return (
                <div className="tile" id={"application" + application.applicationId + index} key={"class_tile_key" + application.applicationId + index}>
                    <div className="tile-header">{application.user.name + " " + application.user.lastname + ", " + application.post.user.name + " " + application.post.user.lastname}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Class</div>
                            <div className="tile-info-body">{application.post.labClass.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Application User</div>
                            <div className="tile-info-body">{application.user.username}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanged Lab</div>
                            <div className="tile-info-body">{application.post.providedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Post User</div>
                            <div className="tile-info-body">{application.post.user.username}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanged Lab</div>
                            <div className="tile-info-body">{application.post.requestedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Time</div>
                            <div className="tile-info-body">{this.getFullTime(application.timestamp)}</div>
                        </div>
                    </div>
                </div>
            );
        });

        labExchanges = labExchanges.length > 0 ? labExchanges : "There aren't any lab exchanges in this class yet.";

        return (
            <div className="LabExchangesWrapper">
                <div className="LabExchanges">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromLabExchanges} 
                        key={this.state.remountHeaderValue} />

                    <div className="class-container">
                        <div className="class-header">
                            <div className="class-title">{this.state.labClassAndLabs.labClass.name}</div>
                            <Link className="class-back" to={"/professor/class/" + this.props.match.params.id}>
                                <i className="fa fa-arrow-left" />
                            </Link>
                        </div>
                        <div className="class-body">
                            <div className="class-info">
                                <div className="class-info-header">{(this.state.labClassAndLabs.labClass.openForRegistrations) ? ("Open for registrations") : ("Closed") }</div>
                                <div className="class-info-body">{this.state.labClassAndLabs.labClass.openForRegistrations}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tiles">
                        {labExchanges}
                    </div>

                </div>
            </div>
          );
    }

}

export default LabExchanges;