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
                body: JSON.stringify({body:credentials}),
            });

            if(response.status === 200) {

                response.json().then((res) => {

                    this.authenticated = true;

                    localStorage.setItem("jwt", res.body.jwt);

                    localStorage.setItem("username", credentials.username);   

                    success();

                });
            
            } else {
                error();
            }

        } catch (e) {
            error();
        }

    }

    logout() {
    
        this.authenticated = false;
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
    
        this.props.history.push("/");
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