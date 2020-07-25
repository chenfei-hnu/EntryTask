import React from 'react';
import useAuth from '@context/auth';
import { RouteComponentProps } from '@reach/router';
import Header from '@Header';
import Login from '@pages/login/Login';
interface PrivateRouteProps extends RouteComponentProps {
    as: React.ElementType<any>;
}

export default function PrivateRoute({
    as: Comp,
    ...props
}: PrivateRouteProps) {
    //用户登陆态
    const {
        state: { user },
    } = useAuth();

    return user && user.id ? (
        <div className="privateContent">
            <Header></Header>
            <Comp {...props} />
        </div>
    ) : (
        <Login />
    );
}
