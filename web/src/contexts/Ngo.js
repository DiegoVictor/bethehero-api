import { createContext } from 'react';

import { setAuthorization } from '~/services/api';

const ngo = JSON.parse(localStorage.getItem('bethehero')) || {};

if (ngo.token) {
  setAuthorization(ngo.token);
}

export default createContext({
  ngo,
  setNgo: () => {},
});
