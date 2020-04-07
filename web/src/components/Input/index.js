import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import { Container, ErrorMessage } from './styles';

export default function Input({ name, type, placeholder, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue = '', registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container {...rest}>
      {type === 'textarea' ? (
        <textarea
          ref={inputRef}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type={type}
          ref={inputRef}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  placeholder: '',
};
