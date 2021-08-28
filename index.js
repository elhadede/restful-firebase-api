const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const uuid = require('uuid');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Expose-Headers', '*')
  next();
})

app.get('/', (req, res) => {
  res.send("sussy balls api ver 0.01");
});
app.get('/get', async (req, res) => {
  let snapshot = await db.collection(req.query.db).orderBy('date','desc').limit(parseInt(req.query.limit)).get();
  let data = []
  snapshot.forEach((doc) => {
    let full = doc.data();
    full["id"] = doc.id;
    data.push(full);
  });
  res.send(data);
});
app.get('/add', async (req, res) => {
  let data = await JSON.parse(req.query.data);
  data["date"] = admin.firestore.Timestamp.fromDate(new Date());;
  await db.collection(req.query.db).doc(uuid.v4()).set(data);
  res.send("DONE");
});
app.listen(port);
