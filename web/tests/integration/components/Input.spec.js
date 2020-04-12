import React from 'react';
import { act, render } from '@testing-library/react';
import { Form } from '@unform/web';
import faker from 'faker';

import Input from '~/components/Input';

describe('Input', () => {
  it('should be able to render a textarea', () => {
    const placeholder = faker.random.words(3);
    const { getByPlaceholderText } = render(
      <Form>
        <Input name="description" type="textarea" placeholder={placeholder} />
      </Form>
    );

    expect(getByPlaceholderText(placeholder)).toBeInTheDocument();
    expect(getByPlaceholderText(placeholder).tagName).toBe('TEXTAREA');
  });

  it('should be able to render an input', () => {
    const placeholder = faker.random.words(3);
    const { getByPlaceholderText } = render(
      <Form>
        <Input name="name" placeholder={placeholder} />
      </Form>
    );

    expect(getByPlaceholderText(placeholder)).toBeInTheDocument();
    expect(getByPlaceholderText(placeholder).tagName).toBe('INPUT');
  });

  it('should be able to render a input error', async () => {
    const error = faker.random.words(5);
    const ref = React.createRef();

    const { getByText } = render(
      <Form ref={ref}>
        <Input name="name" placeholder={faker.random.words(3)} />
      </Form>
    );

    await act(async () => {
      ref.current.setFieldError('name', error);
    });

    expect(getByText(error)).toBeInTheDocument();
  });
});
