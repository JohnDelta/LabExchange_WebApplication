import React from 'react';
import Authentication from './Authentication';
import './Login.css';


class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Login">
                
                Login page
              
                <button onClick={
                    () => {
                        Authentication.login(()=>{
                            this.props.history.push("/messenger");
                        })
                    }
                }>
                    Login and go to messenger
                </button>
        
            </div>
          );
    }

}

export default Login;