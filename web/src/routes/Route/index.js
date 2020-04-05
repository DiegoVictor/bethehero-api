import React from 'react';
import { Route as ReactRouterRoute, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import NgoContext from '~/contexts/Ngo';

export default function Route({
  privated,
  guest,
  component: Component,
  ...rest
}) {
  return (
    <NgoContext.Consumer>
      {({ ngo }) => (
        <ReactRouterRoute
          {...rest}
          render={(props) => {
            if (!ngo.token) {
              if (privated) {
                return <Redirect to="/" />;
              }
            } else if (guest) {
              return <Redirect to="/incidents" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </NgoContext.Consumer>
  );
}

Route.propTypes = {
  privated: PropTypes.bool,
  guest: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

Route.defaultProps = {
  privated: false,
  guest: false,
};
