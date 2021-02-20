import React from 'react';
import './Lab.css';
import PanelTitle from '../UIComponents/PanelTitle';
import Navbar from '../UIComponents/Navbar.js';

class Lab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "lab": {
                "labId": 0,
                "title": "Object Oriented Programming (CTE-0010)",
                "assignedLab": "TR1 (Thurday 14:00-15:00)",
                "isOpen": true
            },
            "posts": [
                {
                    "postId": 0,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                },
                {
                    "postId": 1,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                },
                {
                    "postId": 2,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                },
                {
                    "postId": 3,
                    "title": "Object Oriented Programming (CTE-0010)",
                    "assignedLab": "TR1 (Thurday 14:00-15:00)",
                    "isOpen": true
                }
            ]
        };

        this.openPost = this.openPost.bind(this);
        this.loadLab = this.loadLab.bind(this);
    }

    componentDidMount() {
        
        this.loadLab();

    }

    loadLab() {

        let id = this.props.match.params.id;

        // fetch lab data here later

        let lab = this.state.lab;
        lab.labId = id;

        this.setState({
            "lab": lab
        });

    }

    openPost(e) {

        e.preventDefault(false);
        
        var id = e.target.id;
        this.props.history.push("post/"+id);

    }

    render() {

        var posts = this.state.posts.map((post) => {
            return (
                <div className="tile" onClick={this.openPost} id={post.postId}>
                    <div className="tile-header">{post.title}</div>
                    <div className="tile-body">
                        <div className="tile-info">
                            <div className="tile-info-header">Assigned Lab</div>
                            <div className="tile-info-body">{post.assignedLab}</div>
                        </div>
                        <div className="tile-info">
                            <div className="tile-info-header">Open for registrations</div>
                            <div className="tile-info-body">{post.isOpen}</div>
                        </div>
                    </div>
                </div>
            );
        })

        return (
            <div className="LabWrapper">
                <div className="Lab">

                    <Navbar />

                    <PanelTitle 
                        links={["labs", "lab"]} 
                        linksName={["Labs", "Lab"]}
                        backLink={"labs"}
                        keyValue={"lab"}
                    />

                    <div className="lab-container">
                        <div className="lab-header">{this.state.lab.title}</div>
                        <div className="lab-body">
                            <div className="lab-info">
                                <div className="lab-info-header">Assigned Lab : {this.state.lab.labId}</div>
                                <div className="lab-info-body">{this.state.lab.assignedLab}</div>
                            </div>
                            <div className="lab-info">
                                <div className="lab-info-header">Open for registrations</div>
                                <div className="lab-info-body">{this.state.lab.isOpen}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tiles">
                        {posts}
                    </div>

                </div>
            </div>
          );
    }

}

export default Lab;