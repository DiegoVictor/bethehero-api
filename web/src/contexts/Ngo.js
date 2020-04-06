import { createContext } from 'react';
import { setAuthorization } from '~/services/api';

let ngo = {};
if (typeof localStorage.bethehero_ngo !== 'undefined') {
  const {
    ngo: { name },
    token,
  } = JSON.parse(localStorage.getItem('bethehero_ngo'));
  ngo = {
    name,
    token,
  };
  setAuthorization(token);
}

export default createContext({
  ngo,
  setNgo: () => {},
});
