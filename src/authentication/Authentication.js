import BasicModels from '../Tools/BasicModels.js';
import ServiceHosts from '../Tools/ServiceHosts.js';
import SharedMethods from '../Tools/SharedMethods.js';

class Auth {

    constructor() {
        var auth = localStorage.getItem("jwt");
        if(auth !== undefined && auth !== null && auth !== "") {
            this.authenticated = true; 
        } else {
            this.authenticated = false;
        }
    }

    async login(credentials, onSuccess, onError, history) {

        var url = ServiceHosts.getAuthenticationHost()+"/account/login";
        var jsonBody = JSON.stringify({body:credentials});

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonBody,
            });

            if(response.status === 200) {
                response.json().then((res) => {
                    if (res.status === 200) {

                        this.authenticated = true;
                        localStorage.setItem("jwt", res.body.jwt);
                        localStorage.setItem("name", res.body.name);
                        localStorage.setItem("lastname", res.body.lastname);
                        localStorage.setItem("username", credentials.username);
                        localStorage.setItem("userType", res.body.userType); 
                        if (res.body.userType === "Student") {
                            history.push("/student");
                        } else if (res.body.userType === "Professor") {
                            history.push("/professor");
                        }

                    } else {
                        onError();
                    }
                }, (err) => {onError();});
            } else {
                onError();
            }

        } catch (error) {
            onError();
        }
        
    }

    logout(history) {
    
        this.authenticated = false;
        localStorage.removeItem("jwt");
        localStorage.removeItem("name");
        localStorage.removeItem("lastname");
        localStorage.removeItem("username");
        localStorage.removeItem("userType"); 
    
        history.push("/login");
    }

    isAuthenticated(userType) {
        if (userType === BasicModels.UserTypeBoth() || localStorage.getItem("userType") === userType) {
            return this.authenticated;
        }
        return false;
    }
    
}

export default new Auth();