import React from 'react';
import './MyPosts.css';
import Header from '../UIComponents/Header.js';

class MyPosts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "myPosts": [
                {
                    "postId": 0,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                    "applications": [
                        {
                            "applicationId": 0,
                            "fullname": "IOANNIS MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 1,
                            "fullname": "MIKE MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 2,
                            "fullname": "IOANNIS MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 3,
                            "fullname": "MIKE MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        }
                    ]
                },
                {
                    "postId": 1,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "TR2 (Thurday 15:00-16:00)",
                    "applications": [
                        {
                            "applicationId": 0,
                            "fullname": "IOANNIS MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 1,
                            "fullname": "MIKE MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        }
                    ]
                },
                {
                    "postId": 2,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "requestedLab": "",
                    "applications": [
                        {
                            "applicationId": 0,
                            "fullname": "IOANNIS MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 1,
                            "fullname": "MIKE MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        }
                    ]
                },
                {
                    "postId": 3,
                    "title": "IOANNIS DELIGIANNIS (CS151102)",
                    "assignedLab": "TR3 (Thurday 14:00-15:00)",
                    "requestedLab": "TR4 (Thurday 15:00-16:00)",
                    "applications": [
                        {
                            "applicationId": 0,
                            "fullname": "IOANNIS MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        },
                        {
                            "applicationId": 1,
                            "fullname": "MIKE MIXAS (CS010101)",
                            "username": "cs010101",
                            "timestamp": 12412412
                        }
                    ]
                },
            ]
        };
        this.toggleCollapsible = this.toggleCollapsible.bind(this);
        this.loadMyPosts = this.loadMyPosts.bind(this);
    }

    componentDidMount() {

        this.loadMyPosts();

    }

     async loadMyPosts() {

        var url = "http://localhost:8083/posts/get/by/me"

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

    toggleCollapsible(e) {
        e.target.classList.toggle("open-tile-list-button");
        e.target.nextElementSibling.classList.toggle("close-tile-list-body");
    }

    render() {

        var posts = this.state.myPosts.map((post) => {
            var applications = post.applications.map((application) => {
                return (
                    <div className="tile-list-row" key={"class_tile_application_key"+application.applicationId+post.postId}>
                        <div className="tile-list-row-title">{application.fullname}</div>
                        <div className="tile-list-row-body">
                            <button>Message</button>
                            <button>Request Exchange</button>
                        </div>
                    </div>
                );
            });

            return (
                <div className="tile oneRow" id={post.postId} key={"class_tile_key"+post.postId}>
                    <div className="tile-header">{post.title}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Exchanging</div>
                            <div className="tile-info-body">{post.assignedLab}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">With</div>
                            <div className="tile-info-body">{(post.requestedLab === "") ? ("Any choice") : post.requestedLab }</div>
                        </div>
                        <div className="tile-list">
                            <div className="tile-list-button" onClick={this.toggleCollapsible}>
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
        })

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