import ServiceHosts from '../Tools/ServiceHosts.js';

class Auth {

    constructor() {

        var auth = localStorage.getItem("jwt");
        
        if(auth !== undefined && auth !== null && auth !== "") {
            this.authenticated = true; 
        } else {
            this.authenticated = false;
        }
    
    }

    async login(credentials, success, error) {
        
        var url = ServiceHosts.getAuthenticationHost()+"/account/login"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({body:credentials}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    if (res.status === 200) {
                     
                        this.authenticated = true;

                        localStorage.setItem("jwt", res.body.jwt);
    
                        localStorage.setItem("username", credentials.username);   
    
                        success();

                    } else {
                        error();
                    }

                });
            
            } else {
                error();
            }

        } catch (e) {
            error();
        }

    }

    logout(history) {
    
        this.authenticated = false;
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
    
        history.push("/");
    }

    isAuthenticated() {
        return this.authenticated;
    }



    async signup(credentials, success, error) { // temporal
        
        var url = ServiceHosts.getAuthenticationHost()+"/account/create"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({body:credentials}),
            });

            if(response.status === 200) {
                success();
            
            } else {
                error();
            }

        } catch (error) {
            error();
        }

    }
    
}

export default new Auth();