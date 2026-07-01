import dotenv from 'dotenv';
dotenv.config();

import createServer from './server/index.js';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});