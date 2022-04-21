import express from 'express';
import Mustache from 'mustache';
import * as db from './database.mjs';
const app = express();

app.use(express.static('public'));

// app.use(express.urlencoded({extended: true}));

app.get('/symbols', async (req, res) => {
  let symbolList = await db.getSymbolList();
  res.send(Mustache.render('<ul>{{ #symbols }}<li>{{ code }}</li>{{ /symbols }}</ul>', {symbols: symbolList}));
});

app.listen(8080);