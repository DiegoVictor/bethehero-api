import React, { useCallback, useContext } from 'react';
import { FiPlusSquare } from 'react-icons/fi';

import Heroes from '~/assets/heroes.png';
import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import { Container, Form } from './styles';
import Link from '~/components/Link';
import Input from '~/components/Input';
import api from '~/services/api';
import NgoContext from '~/contexts/Ngo';

export default () => {
  const { setNgo } = useContext(NgoContext);
  const handleLogin = useCallback(
    async ({ id }) => {
      try {
        const { data } = await api.post('sessions', { id });
        localStorage.setItem('bethehero_ngo', JSON.stringify(data));

        setNgo({ name: data.ngo.name, token: data.token });
      } catch (err) {
        alert('Usuário ou senha incorreto(s)!');
      }
    },
    [setNgo]
  );

  return (
    <Layout>
      <Container>
        <section>
          <img src={Logo} alt="Be The Hero" />
          <Form onSubmit={handleLogin}>
            <h1>Faça seu logon</h1>

            <Input name="id" placeholder="Seu ID" />
            <Button type="submit">Entrar</Button>

            <Link to="/register">
              <FiPlusSquare size={20} color="#E02041" />
              Não tenho cadastro
            </Link>
          </Form>
        </section>
        <img src={Heroes} alt="Heroes" />
      </Container>
    </Layout>
  );
};
