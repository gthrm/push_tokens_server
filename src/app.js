import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
import myAsyncAuthorizer from './utils/Auth';

// Разкомментировать в продакшене для подключения SSL сертификата
import https from 'https';

// import http from 'http';
// Разкомментировать в продакшене для подключения SSL сертификата
import path from 'path';

// Разкомментировать в продакшене для подключения SSL сертификата
import fs from 'fs';

import * as db from './utils/DataBaseUtils';
import {serverPort} from '../etc/config.json';

// Разкомментировать в продакшене для подключения SSL сертификата
const options = {
  key: fs.readFileSync(path.join(__dirname, '../../../etc/letsencrypt/live/www.myjpg.ru', 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../../../etc/letsencrypt/live/www.myjpg.ru', 'fullchain.pem')),
};

const app = express();

db.setUpConnection();

app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(
    basicAuth({
      authorizer: myAsyncAuthorizer,
      authorizeAsync: true,
    }),
);


// app.get('/users', (req, res) => {
//   db.listUsers(req.query.page).then((data) => res.send(data)).catch((err) => res.send(err));
// });

// app.post('/user', (req, res) => {
//   db.createUser(req.body).then((data) => {
//     console.log(data); res.send(data);
//   }).catch((err) => res.send(err));
// });

app.get('/token', (req, res) =>
  db.listItems(req.query.page, req.query.expiried)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.get('/token/:id', (req, res) =>
  db.getItemsBySerial(req.params.id)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.post('/token', (req, res) =>
  db.createItems(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.patch('/token/:id', (req, res) =>
  db.updateItems(req.params.id, req.body)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

https.createServer(options, app).listen(serverPort, function() {
  console.log(`Express server listening on port ${serverPort}`);
});
// http.createServer(app).listen(serverPort, function() {
//   console.log(`Express server listening on port ${serverPort}`);
// });
