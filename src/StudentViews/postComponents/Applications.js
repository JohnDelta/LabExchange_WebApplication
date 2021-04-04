import React from 'react';
import './Applications.css';
import Header from '../../UIComponents/Header';
import BasicModels from '../../Tools/BasicModels';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

class Applications extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "applications": []
        };
        this.loadApplications = this.loadApplications.bind(this);
        this.removeApplication = this.removeApplication.bind(this);
        this.openChatroom = this.openChatroom.bind(this);
        this.remountHeaderFromApplication = this.remountHeaderFromApplication.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadApplications();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNewApplication());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromApplication() {
        this.setState({
            remountHeaderValue: Math.random()
        });
      }

    async loadApplications() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/applications/get/by/me";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                applications: sucess.body
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async removeApplication(e) {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/applications/remove";

        let applicationid = e.target.id;

        let application = BasicModels.getApplicationModel();
        application.applicationId = applicationid;
        let jsonBody = JSON.stringify({body:application});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.loadApplications();
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async openChatroom(e) {debugger;
        var othersUsername = e.target.id.split("_")[2];
        this.props.history.push("/student/messenger/user/" + othersUsername);
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
                            <div className="tile-info-body">{application.offersLab.name}</div>
                        </div>
                        <div className="tile-buttons">
                            <button onClick={this.openChatroom} id={"application_openchatroom_"+application.post.user.username} >Message</button>
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

                    <Header 
                        activeTab={"applications"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromApplication} 
                        key={this.state.remountHeaderValue} />
                    
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