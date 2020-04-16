import React, { useCallback, useMemo } from 'react';
import { Image, Linking, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import { useNavigation, useRoute } from '@react-navigation/native';

import Logo from '~/assets/logo.png';
import {
  Action,
  ActionText,
  Actions,
  Back,
  Box,
  Container,
  Description,
  Incident,
  Header,
  Label,
  Title,
  Value,
} from './styles';

export default () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const { incident } = useMemo(() => params, [params]);

  const formated_value = useMemo(() => {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);
  }, [incident]);

  const message = useMemo(
    () =>
      `Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formated_value}`,
    [incident, formated_value]
  );

  const sendMail = useCallback(() => {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.ngo.email],
      body: message,
    });
  }, [incident, message]);

  const sendWhatsApp = useCallback(() => {
    Linking.openURL(
      `whatsapp://send?phone:${incident.ngo.whatsapp}&text=${message}`
    );
  }, [incident, message]);

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Back testID="back" onPress={navigation.goBack}>
          <Feather name="arrow-left" size={28} color="#E82041" />
        </Back>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Incident>
          <Label>ONG</Label>
          <Value>
            {incident.ngo.name} de {incident.ngo.city}/{incident.ngo.uf}
          </Value>

          <Label>CASO</Label>
          <Value>{incident.description}</Value>

          <Label>Valor</Label>
          <Value>{formated_value}</Value>
        </Incident>

        <Box>
          <Title>Salve o dia</Title>
          <Title>Seja o héroi desse caso</Title>

          <Description>Entre em contato:</Description>
          <Actions>
            <Action testID="whatsapp" onPress={sendWhatsApp}>
              <ActionText>WhatsApp</ActionText>
            </Action>
            <Action testID="email" onPress={sendMail}>
              <ActionText>Email</ActionText>
            </Action>
          </Actions>
        </Box>
      </ScrollView>
    </Container>
  );
};
