import { Router } from 'express';

import NgoController from './app/controllers/NgoController';
import IncidentController from './app/controllers/IncidentController';
import NgoIncidentController from './app/controllers/NgoIncidentController';
import SessionController from './app/controllers/SessionController';

import IncidentValidator from './app/validators/IncidentValidator';
import NgoValidator from './app/validators/NgoValidator';
import SessionValidator from './app/validators/SessionValidator';
import IdValidator from './app/validators/IdValidator';
import PageValidator from './app/validators/PageValidator';
import NgoIdValidator from './app/validators/NgoIdValidator';

import bearerAuth from './app/middlewares/bearerAuth';

const Route = Router();

Route.post('/sessions', SessionValidator, SessionController.store);

Route.get('/ngos', PageValidator, NgoController.index);
Route.get('/ngos/:id', IdValidator, NgoController.show);
Route.get(
  '/ngos/:ngo_id/incidents',
  NgoIdValidator,
  PageValidator,
  NgoIncidentController.index
);
Route.post('/ngos', NgoValidator, NgoController.store);

Route.get('/incidents', PageValidator, IncidentController.index);
Route.get('/incidents/:id', IdValidator, IncidentController.show);

Route.use(bearerAuth);

Route.post('/incidents', IncidentValidator, IncidentController.store);
Route.delete('/incidents/:id', IdValidator, IncidentController.destroy);

export default Route;
