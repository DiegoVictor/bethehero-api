import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, fireEvent } from 'react-native-testing-library';
import { create } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';

import api from '~/services/api';
import factory from '../utils/factory';
import Incidents from '~/pages/Incidents';

jest.mock('@react-navigation/native');

describe('Incidents', () => {
  const api_mock = new MockAdapter(api);
  const navigate = jest.fn();

  useNavigation.mockReturnValue({ navigate });

  beforeEach(() => {
    api_mock.reset();
  });

  it('should be able to get a list of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 3);
    api_mock.onGet('/incidents').reply(200, incidents, {
      'x-total-counts': incidents.length,
    });

    let root;
    await act(async () => {
      root = create(<Incidents />);
    });

    const nodes = root.root
      .findAllByType('Text')
      .map((node) => node.children.shift());

    incidents.forEach(({ title, value }) => {
      expect(nodes.includes(title)).toBeTruthy();
      expect(
        nodes.includes(
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(value)
        )
      ).toBeTruthy();
    });
  });

  it('should be able to get a second page of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 10);
    api_mock
      .onGet('/incidents', { params: { page: 1 } })
      .reply(200, incidents.slice(0, 5), {
        'x-total-counts': 10,
        link: 'rel="last"',
      })
      .onGet('/incidents', { params: { page: 2 } })
      .reply(200, incidents.slice(-5), { 'x-total-counts': 10 });

    let root;
    await act(async () => {
      root = create(<Incidents />);
    });

    await act(async () => {
      fireEvent(root.root.findByProps({ testID: 'incidents' }), 'onEndReached');
    });

    const nodes = root.root
      .findAllByType('Text')
      .map((node) => node.children.shift());

    incidents.forEach(({ title, value }) => {
      expect(nodes.includes(title)).toBeTruthy();

      expect(
        nodes.includes(
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
            .format(value)
            .replace(' ', '\u00a0')
        )
      ).toBeTruthy();
    });
  });

  it("should be able to go to the incident's detail", async () => {
    const incident = await factory.attrs('Incident');
    api_mock
      .onGet('/incidents')
      .reply(200, [incident], { 'x-total-counts': 1 });

    let root;
    await act(async () => {
      root = create(<Incidents />);
    });

    fireEvent.press(
      root.root.findByProps({ testID: `incident_${incident.id}_detail` })
    );

    expect(navigate).toHaveBeenCalledWith('Detail', { incident });
  });
});
