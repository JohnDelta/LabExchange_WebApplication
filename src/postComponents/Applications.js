import React from 'react';
import './Applications.css';
import Header from '../UIComponents/Header.js';
import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';

class Applications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "applications": []
        };
        this.loadApplications = this.loadApplications.bind(this);
        this.removeApplication = this.removeApplication.bind(this);
        this.openChatroom = this.openChatroom.bind(this);
    }

    componentDidMount() {
        this.loadApplications();
    }

    async loadApplications() {

        var url = ServiceHosts.getClassesHost()+"/posts/applications/get/by/me"

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
                            applications: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async removeApplication(e) {

        var url = ServiceHosts.getClassesHost()+"/posts/applications/remove";

        let applicationid = e.target.id;

        let application = BasicModels.getApplicationModel();
        application.applicationId = applicationid;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:application}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200) {
                        this.loadApplications();
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async openChatroom(e) {
        var othersUsername = e.target.id.split("_")[2];
        this.props.history.push("/messenger/" + othersUsername);
    }

    render() {

        var applications = this.state.applications.map((application, index) => {
            return (
                <div className="tile" id={"application" + application.applicationId + index} key={"class_tile_key" + application.applicationId + index}>
                    <div className="tile-header">{application.user.username}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Class</div>
                            <div className="tile-info-body">{application.post.labClass.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{application.post.providedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(application.post.requestedLab.name === "" || typeof application.post.requestedLab === "undefined") ? ("Any choice") : application.post.requestedLab.name }</div>
                        </div>
                        <div className="tile-buttons">
                            <button onClick={this.openChatroom} id={"application_openchatroom_"+application.user.username} >Message</button>
                            <button id={application.applicationId} onClick={this.removeApplication} >Cancel Application</button>
                        </div>
                    </div>
                </div>
            );
        });

        applications = applications.length > 0 ? applications : "You haven't made any applications yet.";

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