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

import BearerAuth from './app/middlewares/BearerAuth';
import RateLimit from './app/middlewares/RateLimit';

import { BruteForce } from './database/redis';
import bruteforce_config from './config/bruteforce';

const Route = Router();

Route.post(
  '/sessions',
  new BruteForce(bruteforce_config).prevent,
  SessionValidator,
  SessionController.store
);

Route.use(RateLimit);

Route.get('/ngos', PageValidator, NgoController.index);
Route.get('/ngos/:id', IdValidator, NgoController.show);

Route.get('/incidents', PageValidator, IncidentController.index);
Route.get('/incidents/:id', IdValidator, IncidentController.show);

Route.use(BearerAuth);

Route.post('/incidents', IncidentValidator, IncidentController.store);
Route.delete('/incidents/:id', IdValidator, IncidentController.destroy);

export default Route;
