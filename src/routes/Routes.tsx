import React from 'react';
import { Router } from '@reach/router';
import PrivateRoute from '@PrivateRoute';
import Login from '@components/login/Login';
import List from '@components/list/List';
import Setting from '@components/setting/Setting';
import Detail from '@components/detail/Detail';

export function Routes() {
  return (
    <React.Fragment>
      <Router>
        <PrivateRoute as={List} default path="/" />
        <Login path="/login" />
        <PrivateRoute as={Setting} path="/setting" />
        <PrivateRoute as={List} path="/list" />
        <PrivateRoute as={Detail} path="/detail/:eventId" />
      </Router>
    </React.Fragment>
  );
}