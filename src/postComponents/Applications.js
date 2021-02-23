import React from 'react';
import './Applications.css';
import Header from '../UIComponents/Header.js';

class Applications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "applications": [
                {
                    "applicationId": 0,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "class": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                },
                {
                    "applicationId": 1,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "class": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                },
                {
                    "applicationId": 2,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "class": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                },
                {
                    "applicationId": 3,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "class": "Data Structures (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                },
            ]
        };
    }

    render() {

        var applications = this.state.applications.map((application) => {
            return (
                <div className="tile" id={application.applicationId} key={"class_tile_key"+application.applicationId}>
                    <div className="tile-header">{application.title}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Class</div>
                            <div className="tile-info-body">{application.class}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{application.assignedLab}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(application.requestedLab === "") ? ("Any choice") : application.requestedLab }</div>
                        </div>
                        <div className="tile-buttons">
                            <button>Message</button>
                            <button>Cancel Application</button>
                        </div>
                    </div>
                </div>
            );
        })

        return (
            <div className="ApplicationsWrapper">
                <div className="Applications">

                    <Header activeTab={"applications"} history={this.props.history} />
                    
                    <div className="container-info">
                        <div className="help-message">Helpfull message here</div>
                    </div>

                    <div className="tiles">
                        {applications}
                    </div>

                </div>
            </div>
          );
    }

}

export default Applications;