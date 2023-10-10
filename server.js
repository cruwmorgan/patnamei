// full_server/server.js
import express from 'express';
import router from './routes/index.js';


const app = express();
const port = 1245;
const host = '127.0.0.1';


app.set('view engine', 'ejs');


app.use('/', router);


app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
});

export default app;
