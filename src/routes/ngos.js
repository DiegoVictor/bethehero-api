import { Router } from 'express';

import NgoController from '../app/controllers/NgoController';
import NgoIncidentController from '../app/controllers/NgoIncidentController';
import NgoValidator from '../app/validators/NgoValidator';
import IdValidator from '../app/validators/IdValidator';
import PageValidator from '../app/validators/PageValidator';
import NgoIdValidator from '../app/validators/NgoIdValidator';

const app = Router();

app.get('/', PageValidator, NgoController.index);
app.get('/:id', IdValidator, NgoController.show);
app.get(
  '/:ngo_id/incidents',
  NgoIdValidator,
  PageValidator,
  NgoIncidentController.index
);
app.post('/', NgoValidator, NgoController.store);

export default app;
