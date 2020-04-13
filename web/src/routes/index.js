import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import NgoContext from '~/contexts/Ngo';
import { setAuthorization } from '~/services/api';

import Route from '~/routes/Route';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Incidents from '~/pages/Incidents/Index';
import IncidentCreate from '~/pages/Incidents/Create';

export default () => {
  const [ngo, setNgo] = useState({});

  useEffect(() => {
    if (localStorage.bethehero) {
      const store = JSON.parse(localStorage.bethehero);
      if (store) {
        setNgo(store);
      }
    }
  }, []);

  useEffect(() => {
    const { token } = ngo;
    if (token) {
      setAuthorization(token);
    }
  }, [ngo]);

  return (
    <NgoContext.Provider
      value={{
        ngo,
        setNgo,
      }}
    >
      <BrowserRouter>
        <Route path="/" guest exact component={Login} />
        <Route path="/register" guest component={Register} />

        <Route path="/incidents" exact privated component={Incidents} />
        <Route path="/incidents/create" privated component={IncidentCreate} />
      </BrowserRouter>
    </NgoContext.Provider>
  );
};
