class Auth {

    constructor() {
        var auth = localStorage.getItem("auth");
        if(auth !== undefined) {
            if(auth === "true") {
                this.authenticated = true;
            } else {
                this.authenticated = false;
            }    
        } else {
            this.authenticated = false;
            localStorage.setItem("auth", "false")
        }
    }

    login(cb) {
        this.authenticated = true;
        localStorage.setItem("auth", "true"); // do some magic here
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        localStorage.removeItem("auth");
        cb();
    }

    isAuthenticated() {
        return this.authenticated;
    }
    
}

export default new Auth();