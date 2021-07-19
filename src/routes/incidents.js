import { Router } from 'express';

import IncidentController from '../app/controllers/IncidentController';
import IncidentValidator from '../app/validators/IncidentValidator';
import IdValidator from '../app/validators/IdValidator';
import PageValidator from '../app/validators/PageValidator';
import bearerAuth from '../app/middlewares/bearerAuth';

const app = Router();

const incidentController = new IncidentController();

app.get('/', PageValidator, incidentController.index);
app.get('/:id', IdValidator, incidentController.show);

app.use(bearerAuth);

app.post('/', IncidentValidator, incidentController.store);
app.delete('/:id', IdValidator, incidentController.destroy);

export default app;
