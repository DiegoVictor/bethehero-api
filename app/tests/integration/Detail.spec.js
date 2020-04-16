import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { useNavigation, useRoute } from '@react-navigation/native';
import { composeAsync } from 'expo-mail-composer';
import { Linking } from 'react-native';

import Detail from '~/pages/Detail';
import factory from '../utils/factory';

jest.mock('@react-navigation/native');
jest.mock('expo-mail-composer');

describe('Detail', () => {
  const goBack = jest.fn();

  useNavigation.mockReturnValue({ goBack });
  Linking.openURL = jest.fn();

  it('should be able to see incident details', async () => {
    const incident = await factory.attrs('Incident');

    useRoute.mockReturnValue({ params: { incident } });
    const { getByText } = render(<Detail />);

    expect(
      getByText(
        `${incident.ngo.name} de ${incident.ngo.city}/${incident.ngo.uf}`
      )
    ).toBeTruthy();
    expect(getByText(incident.description)).toBeTruthy();
    expect(
      getByText(
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(incident.value)
      )
    ).toBeTruthy();
  });

  it('should be able to call whatsapp through deep linking', async () => {
    const incident = await factory.attrs('Incident');
    const formated_value = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);

    useRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('whatsapp'));

    expect(Linking.openURL).toHaveBeenCalledWith(
      `whatsapp://send?phone:${incident.ngo.whatsapp}&text=Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formated_value}`
    );
  });

  it('should be able to call mail composer', async () => {
    const incident = await factory.attrs('Incident');
    const formated_value = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);

    useRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('email'));

    expect(composeAsync).toHaveBeenCalledWith({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.ngo.email],
      body: `Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formated_value}`,
    });
  });

  it('should be able to back to previous page', async () => {
    const incident = await factory.attrs('Incident');

    useRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('back'));

    expect(goBack).toHaveBeenCalled();
  });
});
