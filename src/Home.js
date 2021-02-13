import React from 'react';
import './Home.css';
import Navbar from './Navbar.js';

class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Home">

                <Navbar />
                
                Home page
              
                main content here
        
            </div>
          );
    }

}

export default Home;