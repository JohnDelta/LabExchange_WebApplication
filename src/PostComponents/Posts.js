import React from 'react';
import './Posts.css';
import PanelTitle from '../UIComponents/PanelTitle';
import Navbar from '../UIComponents/Navbar.js';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

class Posts extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="PostsWrapper">
                <div className="Posts">

                    <Navbar />

                    <PanelTitle 
                        links={["Posts"]} 
                        linksName={["Posts"]}
                        backLink={""} 
                    />


                </div>
            </div>
          );
    }

}

export default Posts;