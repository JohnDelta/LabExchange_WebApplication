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
            "classes": [
                {
                    "classId": 0,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                },
                {
                    "classId": 1,
                    "title": "Java (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": false
                },
                {
                    "classId": 2,
                    "title": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Monday 14:00-15:00)",
                    "isOpen": false
                },
                {
                    "classId": 3,
                    "title": "Network Programming (CTE-0010)",
                    "assignedLab": "TR1 (Friday 14:00-15:00)",
                    "isOpen": true
                }
            ]
        };

        this.openClass = this.openClass.bind(this);
    }

    openClass(e) {

        e.preventDefault(false);
        
        var id = e.target.id;
        this.props.history.push("class/"+id);

    }

    render() {

        var classes = this.state.classes.map((lab) => {
            return (
                <div 
                    className="tile cancelEvents" 
                    onClick={this.openClass} 
                    id={lab.classId} 
                    key={"classes_lab_"+lab.classId}
                    style={{"cursor":"pointer"}}
                >
                    <div className="tile-header">{lab.title}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Assigned Lab</div>
                            <div className="tile-info-body">{lab.assignedLab}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Open for registrations</div>
                            <div className="tile-info-body">{lab.isOpen}</div>
                        </div>
                    </div>
                </div>
            );
        })

        return (
            <div className="ClassesWrapper">
                <div className="Classes">

                    <Header activeTab={"class"} history={this.props.history} />
                    
                    <div className="classes-new-post">
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