import React from 'react';
import { Routes } from '@Routes';
import { getCurrentUser } from '@api/AuthAPI';
import useAuth, { AuthProvider } from '@context/auth';
import { USER_KEY, TOKEN_KEY } from '@api/APIUtils';
import { getLocalStorageValue } from '@Utils';
import { User } from '@Types';
import { EventProvider } from '@context/events';
import { EventDetailProvider } from '@context/eventDetail';

function App() {
    const {
        state: { user, isAuthenticated },
        dispatch,
    } = useAuth();
    React.useEffect(() => {
        let ignore = false;
        async function fetchUser() {
            try {
                const localUser =
                    JSON.parse(getLocalStorageValue(USER_KEY)) || {};
                const payload = await getCurrentUser(localUser && localUser.id);
                const responseUser: User = payload.data;
                if (!ignore) {
                    dispatch({ type: 'LOAD_USER', user: responseUser });
                }
            } catch (error) {
                console.log(error);
            }
        }
        const token = getLocalStorageValue(TOKEN_KEY);
        if (!user && token) {
            fetchUser();
        }

        return () => {
            ignore = true;
        };
    }, [dispatch, isAuthenticated, user]);

    return (
        <React.Fragment>
            <Routes />
        </React.Fragment>
    );
}

export default () => (
    <AuthProvider>
        <EventProvider>
            <EventDetailProvider>
                <App />
            </EventDetailProvider>
        </EventProvider>
    </AuthProvider>
);
