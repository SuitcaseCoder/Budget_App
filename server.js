const express = require('express');
const app = express();
const port = 8080
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');
const {Event, Expense} = require('./models');
// const {Expense} = require('./models');

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;



app.use(express.static('public'));

app.get('/events', (req,res) => {
  Event
    .find()
    .populate('expenses')
    .exec()
    .then(events => {
      console.log(events)
      return res.json(events)
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({message: 'internal server error'});
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

  Event
    .create({
      title: req.body.title,
      date: req.body.date,
      budget: req.body.budget
    })
    .then(
      event => res.status(201).json(event)
      // .json(obj)
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'});
    });

});

//POST EXPENSES

app.post('/events/:id/expenses', jsonParser, (req, res) => {
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

  Expense
    .create({
      title: req.body.expenses.title,
      percentage: req.body.expenses.percentage
    })
    .then(
      event => res.status(201).json(event)
      // .json(obj)
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'});
    });

});

app.get('/events/:id', (req,res) => {
  Event
    .findById(req.params.id)
    // .then(expense => res.json(expense.serialize()))
    //
    .then(expenses => {
      return res.json(expenses.serialize())
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'internal server error'});
    });
});



// app.post('/expenses', jsonParser, (req, res) => {
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
//   Expense
//     .create({
//       title: req.body.title,
//       percentage: req.body.percentage
//     })
//     .then(
//       event => res.status(201).json(event)
//     )
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({message: 'Internal Server Error'});
//     });
//
// });

let server;


function runServer(port, databaseUrl){
  return new Promise( (resolve, reject) => {
    mongoose.set('debug', true);
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
