import { Router } from 'express';

import IncidentController from '../app/controllers/IncidentController';
import IncidentValidator from '../app/validators/IncidentValidator';
import IdValidator from '../app/validators/IdValidator';
import PageValidator from '../app/validators/PageValidator';
import bearerAuth from '../app/middlewares/bearerAuth';

const app = Router();

app.get('/incidents', PageValidator, IncidentController.index);
app.get('/incidents/:id', IdValidator, IncidentController.show);

app.use(bearerAuth);

app.post('/incidents', IncidentValidator, IncidentController.store);
app.delete('/incidents/:id', IdValidator, IncidentController.destroy);

export default app;
