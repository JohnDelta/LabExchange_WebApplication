import React from 'react';
import './Labs.css';
import Header from '../UIComponents/Header.js';

class Labs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "labs": [
                {
                    "labId": 0,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                },
                {
                    "labId": 1,
                    "title": "Java (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": false
                },
                {
                    "labId": 2,
                    "title": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Monday 14:00-15:00)",
                    "isOpen": false
                },
                {
                    "labId": 3,
                    "title": "Network Programming (CTE-0010)",
                    "assignedLab": "TR1 (Friday 14:00-15:00)",
                    "isOpen": true
                }
            ]
        };

        this.openLab = this.openLab.bind(this);
    }

    openLab(e) {

        e.preventDefault(false);
        
        var id = e.target.id;
        this.props.history.push("lab/"+id);

    }

    render() {

        var labs = this.state.labs.map((lab) => {
            return (
                <div 
                    className="tile cancelEvents" 
                    onClick={this.openLab} 
                    id={lab.labId} 
                    key={"labs_lab_"+lab.labId}
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
            <div className="LabsWrapper">
                <div className="Labs">

                    <Header activeTab={"lab"} history={this.props.history} />
                    
                    <div className="tiles">
                        {labs}
                    </div>

                </div>
            </div>
          );
    }

}

export default Labs;