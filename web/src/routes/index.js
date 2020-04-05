import React, { useState, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Route from '~/routes/Route';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Incidents from '~/pages/Incidents/Index';
import IncidentCreate from '~/pages/Incidents/Create';
import NgoContext from '~/contexts/Ngo';

export default () => {
  const [ngo, setNgo] = useState(useContext(NgoContext).ngo);

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
