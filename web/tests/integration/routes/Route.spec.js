import React from 'react';
import { render } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import faker from 'faker';

import NgoContext from '~/contexts/Ngo';
import Route from '~/routes/Route';

describe('Route', () => {
  const history = createBrowserHistory();
  const name = faker.name.findName();
  const token = faker.random.alphaNumeric(16);

  it('should redirect when not authenticated and request a privated page', () => {
    render(
      <Router history={history} initialEntries={['/incidents']}>
        <Route path="/incidents" exact privated component={() => {}} />
        <Route path="/" exact privated component={() => <div />} />
      </Router>
    );

    expect(history.location.pathname).toBe('/');
  });

  it('should redirect when authenticated and request a guest page', () => {
    render(
      <NgoContext.Provider value={{ ngo: { name, token } }}>
        <Router history={history}>
          <Route path="/" guest component={() => {}} />
        </Router>
      </NgoContext.Provider>
    );

    expect(history.location.pathname).toBe('/incidents');
  });

  it('should be get the requested page', () => {
    const component = jest.fn(() => <div />);

    render(
      <NgoContext.Provider value={{ ngo: { name, token } }}>
        <Router history={history}>
          <Route path="/incidents" privated component={component} />
        </Router>
      </NgoContext.Provider>
    );

    expect(component).toHaveBeenCalled();
  });
});
