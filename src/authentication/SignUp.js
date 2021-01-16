import React from 'react';
import Authentication from './Authentication';
import './SignUp.css';


class SignUp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="SignUp">
                
                SignUp page
              
                <button onClick={
                    () => {
                        Authentication.login(()=>{
                            this.props.history.push("/messenger");
                        })
                    }
                }>
                    SignUp and go to messenger
                </button>
        
            </div>
          );
    }

}

export default SignUp;