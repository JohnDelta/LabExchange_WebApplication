import React from 'react';
import './Navbar.css';
import Authentication from '../authentication/Authentication';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
    }

    toggleNavbar(e) {
        document.getElementById("navbar-body").classList.toggle("display-narbar-body");
        document.getElementById("navbar-button").classList.toggle("display-narbar-button");
    }

    render() {

        if(Authentication.isAuthenticated()) {
            
            return (
                <div className="Navbar">
                    
                    <div className="navbar-button" id="navbar-button" onClick={this.toggleNavbar}>
                        <i className="fa fa-bars" />
                    </div>
    
                    <div className="navbar-body-wrapper" id="navbar-body">
                        <div className="navbar-body">

                            <div className="navbar-title">
                                <span>LabExchange</span>
                                <div className="close-button" onClick={this.toggleNavbar}>
                                    <i className="fa fa-times" />
                                </div>
                            </div>

                            <a className="navbar-link" href="/">
                                <i className="fa fa-file"></i>
                                <span>Labs</span>
                            </a>

                            <a className="navbar-link" href="/messenger">
                                <i className="fa fa-comment"></i>
                                <span>Messenger</span>
                            </a>

                            <a className="navbar-link pulldown" 
                                onClick={
                                    () => {
                                        Authentication.logout();
                                    }
                                } 
                            >
                                <i className="fa fa-sign-out"></i>
                                <span>Exit</span>
                            </a>

                        </div>
                    </div>
                    
                </div>
              );

        } else {
            
            return (
                ""
            );

        }

        
    }

}

export default Navbar;