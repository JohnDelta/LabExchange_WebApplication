import React from 'react';
import './NotFound.css';

import {
    Link
} from "react-router-dom";

class NotFound extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="NotFound">
                <div>You Lost Bro? 404 Page Not Found</div>
                <Link to="/" >Go to Main</Link>
            </div>
          );
    }

}

export default NotFound;