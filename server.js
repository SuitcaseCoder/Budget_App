const express = require('express');
const app = express();
const port = 8080
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');
const {events} = require('./models');

mongoose.Promise = global.Promise;

app.use(express.static('public'));

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    })
    .on('error', err => {
      mongoose.disconnect();
      reject(err);
    });
  });
}

//GET/PUT/POSTS GO ALL IN HERE
//logic for api goes in server or router .js

app.get('/events', (req,res) => {
  Event
    .find()
    .then(events => {
      res.json(event)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'internal server error'});
    });
});

//
// app.get('/events', (req,res) => res.send({
//   console.log('hello hello');
// }))

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {runServer, closeServer, app}
