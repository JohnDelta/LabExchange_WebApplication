import React from 'react';
import './MyPosts.css';
import Header from '../../UIComponents/Header';
import BasicModels from '../../Tools/BasicModels';
import ServiceHosts from '../../Tools/ServiceHosts';
import SharedMethods from '../../Tools/SharedMethods';
import Authentication from '../../authentication/Authentication';

class MyPosts extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            "postsAndApplications": [],
            remountHeaderValue: Math.random(),
            "message": ""
        };
        this.exchangeLabs = this.exchangeLabs.bind(this);
        this.openChatroom = this.openChatroom.bind(this);
        this.toggleCollapsible = this.toggleCollapsible.bind(this);
        this.loadMyPosts = this.loadMyPosts.bind(this);
        this.removePost = this.removePost.bind(this);
        this.remountHeaderFromMyPosts = this.remountHeaderFromMyPosts.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadMyPosts();
        SharedMethods.blockNotificationsFrom(BasicModels.NotificationTypeNewApplication());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    remountHeaderFromMyPosts() {
        this.setState({
            remountHeaderValue: Math.random()
        });
    }

     async loadMyPosts() {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/get/by/me";

        var jsonBody = JSON.stringify({body:""});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.setState({
                postsAndApplications: sucess.body
            });
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async removePost(e) {

        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/remove";

        let postId = e.target.id;
        let post = BasicModels.getPostModel();
        post.postId = postId;
        let jsonBody = JSON.stringify({body:post});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.loadMyPosts();
        }, (err) => {Authentication.logout(this.props.history);});

    }

    async exchangeLabs(e) {
        if (!this._isMounted) {return;}

        var url = ServiceHosts.getClassesHost()+"/posts/exchange-lab";

        let applicationid = e.target.id.split("_")[1];

        let application = BasicModels.getApplicationModel();
        application.applicationId = applicationid;

        var jsonBody = JSON.stringify({body:application});
        
        SharedMethods.authPost(url, jsonBody, (sucess) => {
            this.loadMyPosts();
        }, (err) => {this.setState({message: "Cannot make the lab exchange. The post is changed or removed."});});
    }

    async openChatroom(e) {
        var othersUsername = e.target.id.split("_")[2];
        this.props.history.push("/student/messenger/user/" + othersUsername);
    }

    toggleCollapsible(e) {
        e.target.classList.toggle("open-tile-list-button");
        e.target.nextElementSibling.classList.toggle("close-tile-list-body");
    }

    render() {

        var posts = this.state.postsAndApplications.map((postAndApplication, index) => {
            var applications = postAndApplication.applications.map((application) => {
                return (
                    <div className="tile-list-row" key={"class_tile_application_key"+application.applicationId+postAndApplication.post.postId}>
                        <div className="tile-list-row-title">{application.user.username + " (Offers lab : " + application.offersLab.name + ")"}</div>
                        <div className="tile-list-row-body">
                            <button onClick={this.openChatroom} id={"myposts_openchatroom_"+application.user.username}>Message</button>
                            <button onClick={this.exchangeLabs} id={"my-posts-exchangelab_"+application.applicationId} >Exchange Labs</button>
                        </div>
                    </div>
                );
            });

            applications = applications.length > 0 ? applications : "You don't have applications for this post yet.";

            return (
                <div className="tile oneRow" id={"timeonerow_"+postAndApplication.post.postId+index} key={"class_tile_key"+postAndApplication.post.postId}>
                    <div className="tile-header">
                        <div>{postAndApplication.post.labClass.name}</div>
                        <button id={postAndApplication.post.postId} onClick={this.removePost}><i className="fa fa-times" /></button>
                    </div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{postAndApplication.post.providedLab.name}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(postAndApplication.post.requestedLab.labId === "0") ? ("Any choice") : postAndApplication.post.requestedLab.name }</div>
                        </div>
                        <div className="tile-list">
                            <div className="tile-list-button" onClick={this.toggleCollapsible}>
                                <div className="tile-list-numberOfApplications">{ typeof postAndApplication.applications === "string" ? <div>0</div> : <div>{postAndApplication.applications.length}</div> }</div>
                                <div>Applications</div>
                                <i className="fa fa-angle-right"></i>
                            </div>
                            <div className="tile-list-body close-tile-list-body">
                                {applications}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        posts = posts.length > 0 ? posts : "You haven't made any posts yet.";

        return (
            <div className="MyPostsWrapper">
                <div className="MyPosts">

                    <Header 
                        activeTab={"my-posts"} 
                        history={this.props.history} 
                        remountHeader={this.remountHeaderFromMyPosts} 
                        key={this.state.remountHeaderValue} />

                    <div className="container-info">
                        <div className="help-message">Helpfull message here</div>
                    </div>

                    <div className="container-info">
                        <div className="help-message">{this.state.message}</div>
                    </div>
                    
                    <div className="tiles">
                        {posts}
                    </div>

                </div>
            </div>
          );
    }

}

export default MyPosts;