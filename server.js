const express = require('express');
const app = express();
const port = 8080
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');
const {Event} = require('./models');
const {Expense} = require('./models');

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

//this 
  Event
    .create({
      title: req.body.title,
      date: req.body.date,
      budget: req.body.budget
    })
    .then(
      event => res.status(201).json(restaurant.serialize())
    )
    .catch(err => {
      console.err(err);
      res.status(500).json({message: 'Internal server error'});
    });
//or this
  // const item = Event.create(req.body.title, req.body.date, req.body.budget);
  // res.status(201).json(item);
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

app.post('/expenses', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'percentage'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = Expense.create(req.body.title, req.body.percentage);
  res.status(201).json(item);
});


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
