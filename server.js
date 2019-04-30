const express = require('express');
const app = express();
const port = 8080
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');
const {Event} = require('./models');

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;



app.use(express.static('public'));

app.get('/events', (req,res) => {
  Event
    .find()
    .then(events => {
      res.json(events)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'internal server error'});
    });
});

app.post('/events', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'date', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = Event.create(req.body.title, req.body.date, req.body.budget);
  res.status(201).json(item);
});

app.get('/expenses', (req,res) => {
  Expense
    .find()
    .then(expenses => {
      res.json(expenses)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'internal server error'});
    });
});

// app.post('/expensess', jsonParser, (req, res) => {
//   // ensure `name` and `budget` are in request body
//   const requiredFields = ['title', 'percentage'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   const item = Expense.create(req.body.title, req.body.percentage);
//   res.status(201).json(item);
// });
//
// app.delete()
//

let server;


function runServer(port, databaseUrl){
  return new Promise( (resolve, reject) => {
    mongoose.connect(databaseUrl,
        err => {
          if (err){
            return reject(err);
          }
          else{
            server = app.listen(port, () =>{
              console.log('Your app is running in port ', port);
              resolve();
            })
            .on('error', err => {
              mongoose.disconnect();
              return reject(err);
            });
          }

      }
      );
  });
}

//GET/PUT/POSTS GO ALL IN HERE
//logic for api goes in server or router .js


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
  runServer(8080, DATABASE_URL).catch(err => console.error(err));
}

module.exports = {runServer, closeServer, app}
