import { Router } from 'express';

import NgoController from '../app/controllers/NgoController';
import NgoIncidentController from '../app/controllers/NgoIncidentController';
import NgoValidator from '../app/validators/NgoValidator';
import IdValidator from '../app/validators/IdValidator';
import PageValidator from '../app/validators/PageValidator';
import NgoIdValidator from '../app/validators/NgoIdValidator';

const app = Router();

const ngoController = new NgoController();
const ngoIncidentController = new NgoIncidentController();

app.get('/', PageValidator, ngoController.index);
app.get('/:id', IdValidator, ngoController.show);
app.get(
  '/:ngo_id/incidents',
  NgoIdValidator,
  PageValidator,
  ngoIncidentController.index
);
app.post('/', NgoValidator, ngoController.store);

export default app;
