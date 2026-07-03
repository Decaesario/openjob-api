import express from 'express';
import routes from '../routes/index.js';
import errorHandler from '../middleware/error.js';

const createServer = () => {
    const app = express();

    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use(routes);
    app.use(errorHandler);

    return app;
};

export default createServer;