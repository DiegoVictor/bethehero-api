import React, { useCallback, useContext, useRef } from 'react';
import { FiPlusSquare } from 'react-icons/fi';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Heroes from '~/assets/heroes.png';
import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Layout from '~/components/Layout';
import Link from '~/components/Link';
import NgoContext from '~/contexts/Ngo';
import api, { setAuthorization } from '~/services/api';
import { Container, Form } from './styles';

export default () => {
  const form_ref = useRef(null);
  const { setNgo } = useContext(NgoContext);

  const handleLogin = useCallback(
    async ({ id }) => {
      try {
        const schema = Yup.object().shape({
          id: Yup.string().required('Por favor, informe o id da ONG'),
        });

        await schema.validate({ id }, { abortEarly: false });

        const { data } = await api.post('sessions', { id });
        localStorage.setItem('bethehero_ngo', JSON.stringify(data));

        setAuthorization(data.token);
        setNgo({ name: data.ngo.name, token: data.token });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validation_errors = {};
          err.inner.forEach((error) => {
            validation_errors[error.path] = error.message;
          });
          form_ref.current.setErrors(validation_errors);
        } else {
          toast.error('Usuário e/ou senha incorreto(s)!');
        }
      }
    },
    [setNgo]
  );

  return (
    <Layout>
      <Container>
        <section>
          <img src={Logo} alt="Be The Hero" />
          <Form ref={form_ref} onSubmit={handleLogin}>
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
