import { Router } from '@reach/router';
import PrivateRoute from '@PrivateRoute';
import React, { Suspense } from 'react';

const List = React.lazy(() =>
    import(/* webpackChunkName: "list" */ '@pages/list/List')
);
const Setting = React.lazy(() =>
    import(/* webpackChunkName: "setting" */ '@pages/setting/Setting')
);
const Detail = React.lazy(() =>
    import(/* webpackChunkName: "detail" */ '@pages/detail/Detail')
);

export function Routes() {
    return (
        <React.Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <Router>
                    <PrivateRoute as={List} default path="/" />
                    <PrivateRoute as={Setting} path="/setting" />
                    <PrivateRoute as={Detail} path="/detail/:eventId" />
                </Router>
            </Suspense>
        </React.Fragment>
    );
}
