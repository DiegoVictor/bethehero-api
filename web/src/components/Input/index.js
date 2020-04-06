import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import { ErrorMessage } from './styles';

export default function Input({ name, type, ...rest }) {
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
    <>
      {type === 'textarea' ? (
        <textarea ref={inputRef} defaultValue={defaultValue} {...rest} />
      ) : (
        <input
          type={type}
          ref={inputRef}
          defaultValue={defaultValue}
          {...rest}
        />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};
