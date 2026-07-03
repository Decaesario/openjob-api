import { Router } from 'express';
import usersRouter from '../users/routes/index.js';
import authenticationsRouter from '../authentications/routes/index.js';
import companiesRouter from '../companies/routes/index.js';
import categoriesRouter from '../categories/routes/index.js';
import jobsRouter from '../jobs/routes/index.js';
import applicationsRouter from '../applications/routes/index.js';
import bookmarksRouter from '../bookmarks/routes/index.js';
import profileRouter from '../profile/routes/index.js';
import documentsRouter from '../documents/routes/index.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/authentications', authenticationsRouter);
router.use('/companies', companiesRouter);
router.use('/categories', categoriesRouter);
router.use('/jobs', jobsRouter);
router.use('/applications', applicationsRouter);
router.use('/bookmarks', bookmarksRouter);
router.use('/profile', profileRouter);
router.use('/', documentsRouter);

export default router;