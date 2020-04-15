import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Logo from '~/assets/logo.png';
import api from '~/services/api';
import {
  Button,
  ButtonText,
  Container,
  Description,
  Incidents,
  Incident,
  Header,
  Label,
  Strong,
  Text,
  Title,
  Value,
} from './styles';

export default () => {
  const { navigate } = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [has_more, setHasMore] = useState(true);

  const getPage = useCallback(async () => {
    setLoading(true);
    const { headers, data } = await api.get('incidents', {
      params: { page },
    });
    setIncidents([...incidents, ...data]);

    if (headers['x-total-count'] !== total) {
    setTotal(headers['x-total-count']);
    }

    setLoading(false);

    if (
      typeof headers.link !== 'string' ||
      headers.link.search(/rel="last"/gi) === -1
    ) {
      setHasMore(false);
    }
  }, [incidents, page, total]);

  const getNextPage = useCallback(() => {
    if (!loading && has_more) {
    setPage(page + 1);
    }
  }, [loading, has_more, page, setPage]);

  useEffect(() => {
    getPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Text>
          Total de <Strong>{total} casos</Strong>.
        </Text>
      </Header>
      <Title>Bem-vindo!</Title>
      <Description>Escolha um dos casos abaixo e salve o dia.</Description>

      <Incidents
        data={incidents}
        keyExtractor={(incident) => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={getNextPage}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <Incident>
            <Label>ONG</Label>
            <Value>{incident.ngo.name}</Value>

            <Label>CASO</Label>
            <Value>{incident.title}</Value>

            <Label>Valor</Label>
            <Value>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(incident.value)}
            </Value>

            <Button
              onPress={() => {
                navigate('Detail', { incident });
              }}
            >
              <ButtonText>Ver mais detalhes</ButtonText>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </Button>
          </Incident>
        )}
      />
    </Container>
  );
};
