import React from 'react';
import './Applications.css';
import Header from '../UIComponents/Header.js';

class Applications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "applications": []
        };
        this.loadApplications = this.loadApplications.bind(this);
    }

    componentDidMount() {
        
        this.loadApplications();
    
    }

    async loadApplications() {

        var url = "http://localhost:8083/posts/applications/get/by/me"

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
                            myPosts: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    render() {

        var applications = this.state.applications.map((application) => {
            return (
                <div className="tile" id={application.applicationId} key={"class_tile_key"+application.applicationId}>
                    <div className="tile-header">{application.post.labClass.name}</div>
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
                            <button>Message</button>
                            <button>Cancel Application</button>
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