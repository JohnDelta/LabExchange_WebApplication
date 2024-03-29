import React from 'react';
import './Classes.css';
import Header from '../../UIComponents/Header';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

import {
    Link
  } from "react-router-dom";
import BasicModels from '../../Tools/BasicModels';

class Classes extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "labClassesAndLabs": [],
            remountHeaderValue: Math.random()
        };

        this.openClass = this.openClass.bind(this);
        this.loadUserClasses = this.loadUserClasses.bind(this);
        this.remountHeaderFromClasses = this.remountHeaderFromClasses.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadUserClasses();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNone());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromClasses() {
        this.setState({
            remountHeaderValue: Math.random()
        });
      }

    openClass(e) {
        e.preventDefault(false);
        var id = e.target.id;
        this.props.history.push("/student/class/"+id);
    }

    async loadUserClasses() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/classes/student/get/by/me";

        var jsonBody = JSON.stringify({body:""});

        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                labClassesAndLabs: sucess.body
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    render() {

        var classes = this.state.labClassesAndLabs.map((labClassAndLab) => {
            return (
                <div 
                    className="tile cancelEvents" 
                    onClick={this.openClass} 
                    id={labClassAndLab.labClass.labClassId} 
                    key={"classes_lab_"+labClassAndLab.labClass.labClassId}
                    style={{"cursor":"pointer"}}
                >
                    <div className="tile-header">{labClassAndLab.labClass.name}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Assigned Lab</div>
                            <div className="tile-info-body">{labClassAndLab.lab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Open for registrations</div>
                            <div className="tile-info-body">{(labClassAndLab.labClass.openForRegistrations) ? ("Open") : ("Closed") }</div>
                        </div>
                    </div>
                </div>
            );
        });

        classes = classes.length > 0 ? classes : "There aren't any classes in your account yet.";

        return (
            <div className="ClassesWrapper">
                <div className="Classes">

                    <Header 
                        activeTab={"class"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromClasses} 
                        key={this.state.remountHeaderValue} />
                    
                    <div className="container-info classes-new-post">
                        <div className="help-message">Helpfull message here</div>
                        <Link to="/student/post/new/classes">
                            <i className="fa fa-plus" />
                            <div>New Post</div>
                        </Link>
                    </div>

                    <div className="tiles">
                        {classes}
                    </div>

                </div>
            </div>
          );
    }

}

export default Classes;