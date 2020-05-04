import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { toast } from 'react-toastify';
import faker from 'faker';

import NgoContext from '~/contexts/Ngo';
import api from '~/services/api';
import Login from '~/pages/Login';

jest.mock('react-toastify');

describe('Login', () => {
  const api_mock = new MockAdapter(api);
  const history = createBrowserHistory();
  const setNgo = jest.fn();
  const id = faker.random.number();
  const name = faker.name.findName();
  const token = faker.random.alphaNumeric(16);

  it('should be able to login', async () => {
    api_mock.onPost('sessions').reply(200, { ngo: { id, name }, token });

    const { getByTestId, getByPlaceholderText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router history={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu ID'), { target: { value: id } });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(localStorage.getItem('bethehero')).toBe(
      JSON.stringify({ id, name, token })
    );
    expect(setNgo).toHaveBeenCalledWith({ id, name, token });
  });

  it('should not be able to login', async () => {
    api_mock.onPost('sessions').reply(400);
    toast.error = jest.fn();

    const { getByTestId, getByPlaceholderText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router history={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Seu ID'), { target: { value: id } });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Usuário e/ou senha incorreto(s)!'
    );
  });

  it('should form validation fail', async () => {
    const { getByTestId, getByText } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router history={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Por favor, informe o id da ONG')).toBeInTheDocument();
  });

  it('should be able to navigate to register page', () => {
    const { getByTestId } = render(
      <NgoContext.Provider value={{ ngo: {}, setNgo }}>
        <Router history={history}>
          <Login />
        </Router>
      </NgoContext.Provider>
    );

    fireEvent.click(getByTestId('register'));

    expect(history.location.pathname).toBe('/register');
  });
});
