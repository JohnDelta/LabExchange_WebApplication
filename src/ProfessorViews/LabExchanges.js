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
            "labExchanges": [] // applications order by username order by timestamp
        };

        this.toggleRegistrations = this.toggleRegistrations.bind(this);
        this.loadClass = this.loadClass.bind(this);
        this.remountHeaderFromLabExchanges = this.remountHeaderFromLabExchanges.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadClass();
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

    async toggleRegistrations() {

        if (!this._isMounted) {return;}

        let id = this.props.match.params.id;
        var url = ServiceHosts.getClassesHost()+"/classes/professor/toggle-registrations";

        var labClassObject = BasicModels.getLabClassModel();
        labClassObject.labClassId = id;
        var jsonBody = JSON.stringify({body:labClassObject});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.loadClass();
        }, (error) => {Authentication.logout(this.props.history);});        

    }

    render() {

        // var labs = this.state.labClassAndLabs.labs.map((lab) => {
        //     return (
        //         <div 
        //             className="tile cancelEvents" 
        //             onClick={this.openLab} 
        //             id={lab.labId} 
        //             key={"classes_lab_"+lab.labId}
        //             style={{"cursor":"pointer"}}
        //         >
        //             <div className="tile-header">{lab.name}</div>
        //             <div className="tile-body">
        //             </div>
        //         </div>
        //     );
        // });

        // labs = labs.length > 0 ? labs : "There aren't any classes in your account yet.";

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
                            <div className="class-buttons">
                                <button onClick={this.toggleRegistrations}>
                                    {(this.state.labClassAndLabs.labClass.openForRegistrations) ? ("Close registrations") : ("Open registrations") }
                                </button>
                                <button onClick={this.openLabExchanges}>Open lab exchanges</button>
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

export default LabExchanges;