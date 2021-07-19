import { Router } from 'express';

import incidents from './incidents';
import ngos from './ngos';
import sessions from './sessions';

const app = Router();

app.use('/sessions', sessions);
app.use('/ngos', ngos);

app.use('/incidents', incidents);

export default app;
