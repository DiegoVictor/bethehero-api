import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import SessionValidator from '../app/validators/SessionValidator';

const app = Router();

app.post('/', SessionValidator, SessionController.store);

export default app;
