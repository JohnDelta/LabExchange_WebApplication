import React from 'react';
import './NotFound.css';
import Authentication from '../authentication/Authentication';
import BasicModels from '../Tools/BasicModels';

import {
    Link
} from "react-router-dom";

class NotFound extends React.Component {
    
    render() { 
        if (Authentication.isAuthenticated(BasicModels.UserTypeProfessor())) {
            return (
                <div className="NotFound">
                    <div>You Lost Bro? 404 Page Not Found</div>
                    <Link to="/professor" >Go to main</Link>
                </div>
            ); 
        } else if (Authentication.isAuthenticated(BasicModels.UserTypeStudent())) {
            return (
                <div className="NotFound">
                    <div>You Lost Bro? 404 Page Not Found</div>
                    <Link to="/student" >Go to main</Link>
                </div>
            ); 
        } else {
            return (
                <div className="NotFound">
                    <div>You Lost Bro? 404 Page Not Found</div>
                    <Link to="/login" >Go Login pls..</Link>
                </div>
            );
        }
    }

}

export default NotFound;