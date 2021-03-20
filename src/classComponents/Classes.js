import React from 'react';
import './Classes.css';
import Header from '../UIComponents/Header.js';
import ServiceHosts from '../Tools/ServiceHosts.js';
import SharedMethods from '../Tools/SharedMethods.js';

import {
    Link
  } from "react-router-dom";
import BasicModels from '../Tools/BasicModels';

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
        this.props.history.push("class/"+id);

    }

    async loadUserClasses() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/classes/get/by/me"

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
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

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
                        <Link to="/post/new/classes">
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