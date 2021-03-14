import React from 'react';
import './MyPosts.css';
import Header from '../UIComponents/Header.js';
import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';

class MyPosts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "postsAndApplications": []
        };
        this.toggleCollapsible = this.toggleCollapsible.bind(this);
        this.loadMyPosts = this.loadMyPosts.bind(this);
        this.removePost = this.removePost.bind(this);
    }

    componentDidMount() {

        this.loadMyPosts();

    }

     async loadMyPosts() {

        var url = ServiceHosts.getClassesHost()+"/posts/get/by/me";

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
                            postsAndApplications: res.body
                        });
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

    }

    async removePost(e) {

        var url = ServiceHosts.getClassesHost()+"/posts/remove";

        let postId = e.target.id;

        let post = BasicModels.getPostModel();
        post.postId = postId;

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({body:post}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if(res.status === 200) {
                        this.loadMyPosts();
                    }

                });
            
            } else {}

        } catch (error) {console.log(error);}

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
                        <div className="tile-list-row-title">{application.user.username}</div>
                        <div className="tile-list-row-body">
                            <button>Message</button>
                            <button>Request Exchange</button>
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
                            <div className="tile-info-body">{(postAndApplication.post.requestedLab === "" || typeof postAndApplication.post.requestedLab === "undefined") ? ("Any choice") : postAndApplication.post.requestedLab.name }</div>
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

                    <Header activeTab={"my-posts"} history={this.props.history} />

                    <div className="container-info">
                        <div className="help-message">Helpfull message here</div>
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