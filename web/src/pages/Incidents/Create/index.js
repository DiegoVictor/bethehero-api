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
import api from '~/services/api';
import { Container, Form, Section } from './styles';

export default () => {
  const history = useHistory();
  const form_ref = useRef(null);

  const handleCreate = useCallback(
    async ({ title, description, value }) => {
      try {
        const schema = Yup.object().shape({
          title: Yup.string().min(3).required('O título é obrigatório'),
          description: Yup.string()
            .min(10, 'A descrição deve conter pelo menos 10 caracteres')
            .required('A descrição é obrigatória'),
          value: Yup.string().required('O valor é obrigatório'),
        });

        await schema.validate(
          { title, description, value },
          { abortEarly: false }
        );
        await api.post('incidents', { title, description, value });
        toast.success('Caso cadastrado com sucesso!');

        history.push('/incidents');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validation_errors = {};
          err.inner.forEach((error) => {
            validation_errors[error.path] = error.message;
          });
          form_ref.current.setErrors(validation_errors);
        } else {
          toast.error('Erro ao cadastrar caso, tente novamente!');
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
            <h1>Novo Caso</h1>
            <p>
              Descreva o caso detalhadamente para encontrar um héroi para
              resolver isso.
            </p>
            <Link data-testid="back" to="/incidents">
              <FiArrowLeft size={20} color="#E02041" />
              Voltar
            </Link>
          </Section>

          <Form ref={form_ref} onSubmit={handleCreate}>
            <Input name="title" placeholder="Título do caso" />
            <Input type="textarea" name="description" placeholder="Descrição" />
            <Input
              name="value"
              type="number"
              min="1"
              step="0.01"
              placeholder="Valor em reais"
            />

            <Button data-testid="submit" type="submit">
              Cadastrar
            </Button>
          </Form>
        </div>
      </Container>
    </Layout>
  );
};
