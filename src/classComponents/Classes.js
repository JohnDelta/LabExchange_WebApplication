import React from 'react';
import './Classes.css';
import Header from '../UIComponents/Header.js';

import {
    Link
  } from "react-router-dom";

class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "classes": []
        };

        this.openClass = this.openClass.bind(this);
        this.loadUserClasses = this.loadUserClasses.bind(this);
    }

    componentDidMount() {
        this.loadUserClasses();
    }

    openClass(e) {

        e.preventDefault(false);
        
        var id = e.target.id;
        this.props.history.push("class/"+id);

    }

    async loadUserClasses() {

        var url = "http://localhost:8083/classes/myClassesAndLabs/get"

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
                            classes: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    render() {

        var classes = this.state.classes.map((classMap) => {
            return (
                <div 
                    className="tile cancelEvents" 
                    onClick={this.openClass} 
                    id={classMap.labClass.labClassId} 
                    key={"classes_lab_"+classMap.labClass.labClassId}
                    style={{"cursor":"pointer"}}
                >
                    <div className="tile-header">{classMap.labClass.name}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Assigned Lab</div>
                            <div className="tile-info-body">{classMap.lab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Open for registrations</div>
                            <div className="tile-info-body">{(classMap.labClass.openForRegistrations) ? ("Open") : ("Closed") }</div>
                        </div>
                    </div>
                </div>
            );
        })

        return (
            <div className="ClassesWrapper">
                <div className="Classes">

                    <Header activeTab={"class"} history={this.props.history} />
                    
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