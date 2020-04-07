import React, { useCallback, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Logo from '~/assets/logo.svg';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Layout from '~/components/Layout';
import Link from '~/components/Link';
import { Container, Form, Section } from './styles';
import api from '~/services/api';

export default () => {
  const history = useHistory();
  const form_ref = useRef(null);

  const handleRegister = useCallback(
    async ({ name, email, whatsapp, city, state }) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().min(3).required('O nome da ONG é obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('O email é obrigatório'),
          whatsapp: Yup.string()
            .required('O WhatsApp é obrigatório')
            .min(10, 'Um número válido deve conter pelo menos 10 caracteres')
            .max(11, 'Um número válido deve conter no máximo 11 caracteres'),
          city: Yup.string().required('A cidade é obrigatória'),
          state: Yup.string()
            .required('O estado é obrigatório')
            .max(2, 'Digite apenas a UF do estado'),
        });

        await schema.validate(
          { name, email, whatsapp, city, state },
          { abortEarly: false }
        );

        const { data } = await api.post('ngos', {
          name,
          email,
          whatsapp,
          city,
          uf: state,
        });

        toast.success(
          `ONG cadastrada com sucesso, ID: ${data.id}. Clique para copiar!`,
          {
            closeOnClick: false,
            onClick: () => {
              navigator.clipboard.writeText(data.id);
            },
          }
        );

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validation_errors = {};
          err.inner.forEach((error) => {
            validation_errors[error.path] = error.message;
          });
          form_ref.current.setErrors(validation_errors);
        } else {
          toast.error('Erro ao cadastrar ONG, tente novamente!');
      }
      }
    },
    [history]
  );

  return (
    <Layout>
      <Container>
        <div>
          <Section>
            <img src={Logo} alt="Be The Hero" />
            <h1>Cadastro</h1>
            <p>
              Faça seu cadastro, entre na plataforma e ajude pessoas a
              encontrarem os casos da sua ONG.
            </p>
            <Link to="/">
              <FiArrowLeft size={20} color="#E02041" />
              Já tenho cadastro
            </Link>
          </Section>

          <Form ref={form_ref} onSubmit={handleRegister}>
            <Input name="name" placeholder="Nome da ONG" />
            <Input name="email" type="email" placeholder="Email" />
            <Input name="whatsapp" placeholder="WhatsApp" />

            <div>
              <Input name="city" placeholder="Cidade" />
              <Input name="state" placeholder="UF" style={{ width: 80 }} />
            </div>

            <Button type="submit">Cadastrar</Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
};
