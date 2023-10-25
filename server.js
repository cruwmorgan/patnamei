// full_server/server.js
import express from 'express';
import axios from 'axios';
import * as path from 'path';
import cors from 'cors';
import { ObjectId } from 'mongoose';
import sha1 from 'sha1';
import bodyParser from 'body-parser';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 1245;
const host = '127.0.0.1';


app.set('view engine', 'ejs');
// static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
});

export default app;
