import React from 'react';
import ReactDOM from 'react-dom';
import { toast, Flip } from 'react-toastify';

import '~/config/ReactotronConfig';
import Navigation from './routes';

toast.configure({
  autoClose: false,
  transition: Flip,
});

ReactDOM.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>,
  document.getElementById('root')
);
