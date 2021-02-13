import React from 'react';
import './Navbar.css';


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
        return (
            <div className="Navbar">
                
                <div className="navbar-button" id="navbar-button" onClick={this.toggleNavbar}>
                    <i className="fa fa-bars" />
                </div>

                <div className="navbar-body" id="navbar-body">

                    <div className="navbar-link close-button" onClick={this.toggleNavbar}>
                        <i className="fa fa-times" />
                    </div>

                    <a className="navbar-link" href="#home">
                        <i className="fa fa-home"></i>
                        <span>Home</span>
                    </a>

                    <a className="navbar-link" href="#home">
                        <i className="fa fa-home"></i>
                        <span>Home</span>
                    </a>

                    <a className="navbar-link" href="#home">
                        <i className="fa fa-home"></i>
                        <span>Home</span>
                    </a>

                    <a className="navbar-link pulldown" href="#home">
                        <i className="fa fa-sign-out"></i>
                        <span>Exit</span>
                    </a>

                </div>
        
            </div>
          );
    }

}

export default Navbar;