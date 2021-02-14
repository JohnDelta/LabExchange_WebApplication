import React from 'react';
import './NotFound.css';

class NotFound extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="NotFound">
                You Lost Bro? 404 Page Not Found
            </div>
          );
    }

}

export default NotFound;