import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import api from '~/services/api';
import factory from '../../../utils/factory';
import Create from '~/pages/Incidents/Create';

jest.mock('react-toastify');

describe('Incidents/Create', () => {
  const api_mock = new MockAdapter(api);
  const history = createBrowserHistory();

  it('should be able to back to incidents page', () => {
    const { getByTestId } = render(
      <Router history={history}>
        <Create />
      </Router>
    );

    fireEvent.click(getByTestId('back'));

    expect(history.location.pathname).toBe('/incidents');
  });

  it('should be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');
    api_mock.onPost('incidents').reply(200);
    toast.success = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <Router history={history}>
        <Create />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.success).toHaveBeenCalledWith('Caso cadastrado com sucesso!');
    expect(history.location.pathname).toBe('/incidents');
  });

  it('should not be able to create an incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');
    api_mock.onPost('incidents').reply(400);
    toast.error = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <Router history={history}>
        <Create />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Título do caso'), {
      target: { value: title },
    });
    fireEvent.change(getByPlaceholderText('Descrição'), {
      target: { value: description },
    });
    fireEvent.change(getByPlaceholderText('Valor em reais'), {
      target: { value },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Erro ao cadastrar caso, tente novamente!'
    );
    expect(history.location.pathname).toBe('/incidents');
  });

  it('should form fail in validation', async () => {
    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Create />
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('O título é obrigatório')).toBeInTheDocument();
    expect(getByText('A descrição é obrigatória')).toBeInTheDocument();
    expect(getByText('O valor é obrigatório')).toBeInTheDocument();
  });
});
