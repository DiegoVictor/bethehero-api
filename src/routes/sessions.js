import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import SessionValidator from '../app/validators/SessionValidator';

const app = Router();

const sessionController = new SessionController();

app.post('/', SessionValidator, sessionController.store);

export default app;
