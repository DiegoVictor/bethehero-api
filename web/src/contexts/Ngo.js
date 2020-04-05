import { createContext } from 'react';

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
}

export default createContext({
  ngo,
  setNgo: () => {},
});
