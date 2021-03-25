import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Authentication from './Authentication';

function ProtectedRoute({ component: Component, ...rest}) {
    return (
        <Route
            {...rest}
            render={props => {
                if(Authentication.isAuthenticated(rest.requiredUserType)) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={{
                        pathname: "/login",
                        state: {
                            from: props.location
                        }}
                    } />
                }
            }}
        />
    );
}

export default ProtectedRoute;