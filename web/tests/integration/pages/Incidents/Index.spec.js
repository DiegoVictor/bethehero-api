import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import api from '~/services/api';
import factory from '../../../utils/factory';
import Index from '~/pages/Incidents/Index';

jest.mock('react-toastify');

describe('Incidents/Index', () => {
  const api_mock = new MockAdapter(api);
  const history = createBrowserHistory();

  beforeEach(() => {
    const name = faker.name.findName();
    const token = faker.random.alphaNumeric(16);

    localStorage.clear();
    localStorage.setItem('bethehero', JSON.stringify({ name, token }));
    api_mock.reset();
  });

  it('should be able to retrieve a list of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 3);
    api_mock.onGet('/ngo_incidents').reply(200, incidents);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Index />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    incidents.forEach((incident) => {
      expect(getByText(incident.title)).toBeInTheDocument();
      expect(getByText(incident.description)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`).textContent).toBe(
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
          .format(incident.value)
          .replace(' ', '\u00a0')
      );
    });
  });

  it('should be able to retrieve the second page of incidents', async () => {
    jest.useFakeTimers();

    const incidents = await factory.attrsMany('Incident', 10);
    api_mock
      .onGet('/ngo_incidents', { params: { page: 1 } })
      .reply(200, incidents.slice(0, 5))
      .onGet('/ngo_incidents', { params: { page: 2 } })
      .reply(200, incidents.slice(-5), { link: '' });

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Index />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    fireEvent.scroll(window, {
      target: { scrollY: 100 },
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    incidents.forEach((incident) => {
      expect(getByText(incident.title)).toBeInTheDocument();
      expect(getByText(incident.description)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`)).toBeInTheDocument();
      expect(getByTestId(`incident_${incident.id}_value`).textContent).toBe(
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
          .format(incident.value)
          .replace(' ', '\u00a0')
      );
    });
  });

  it('should be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident');
    toast.success = jest.fn();

    api_mock
      .onGet('/ngo_incidents')
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(200);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Index />
        </Router>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`incident_${incident.id}_delete`));
    });

    expect(toast.success).toHaveBeenCalledWith('Caso removido com sucesso!');
  });

  it('should not be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident');
    toast.error = jest.fn();

    api_mock
      .onGet('/ngo_incidents')
      .reply(200, [incident])
      .onDelete(`/incidents/${incident.id}`)
      .reply(400);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Index />
        </Router>
      );

      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`incident_${incident.id}_delete`));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erro ao remover caso, tente novamente!'
    );
  });

  it('should be able to logout', async () => {
    api_mock.onGet('/ngo_incidents').reply(200, []);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Index />
        </Router>
      );

      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('logout'));

    expect(history.location.pathname).toBe('/');
    expect(localStorage.getItem('bethehero')).toBeFalsy();
  });
});
