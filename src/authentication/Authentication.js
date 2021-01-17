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
        
        var url = "http://localhost:8081/account/login"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    this.authenticated = true;

                    localStorage.setItem("jwt", res.jwt);    

                    success();

                });
            
            } else {
                error();
            }

        } catch (error) {
            error();
        }

    }

    logout(callback) {
    
        this.authenticated = false;
        localStorage.removeItem("jwt");
    
        callback();
    }

    isAuthenticated() {
        return this.authenticated;
    }



    async signup(credentials, success, error) { // temporal
        
        var url = "http://localhost:8081/account/create"

        try {

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
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