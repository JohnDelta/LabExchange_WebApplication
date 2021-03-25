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

    async login(credentials, onSuccess, onError) {

        var url = ServiceHosts.getAuthenticationHost()+"/account/login";
        var jsonBody = JSON.stringify({body:credentials});

        SharedMethods.authPost(url, jsonBody, (sucess)=>{

            this.authenticated = true;
            localStorage.setItem("jwt", sucess.body.jwt);
            localStorage.setItem("name", sucess.body.name);
            localStorage.setItem("lastname", sucess.body.lastname);
            localStorage.setItem("username", credentials.username);
            localStorage.setItem("userType", sucess.body.userType); 
            if (sucess.body.userType === "Student") {
                this.history.push("/Student")
            } else if (sucess.body.userType === "Professor") {
                this.history.push("/professor");
            }

        }, (error)=>{
            onError();
        });
        
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
        if (localStorage.getItem("userType") === userType) {
            return this.authenticated;
        }
        return false;
    }
    
}

export default new Auth();