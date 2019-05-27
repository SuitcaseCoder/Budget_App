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

app.post('/expenses', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'percentage','event'];
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
      title: req.body.title,
      percentage: req.body.percentage,
    })
    .then(expense => {
      console.log('---------------------------')
      console.log(expense);
      console.log('---------------------------')

      //query event model
      Event.findByIdAndUpdate(req.body.event, {
        $push: {expenses:expense._id}
      }).then( _ => {
        return res.status(201).json(expense)}
      )}
  )
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'});
    });

});

app.get('/events/:id', (req,res) => {
  Event
    .findById(req.params.id)
    .then(expense => res.json(expense))

      // .then(populate('expenses'))
    //
    .then(expenses => {
      console.log(res.json(expenses.serialize()))
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'internal server error'});
    });
});

// app.get('/events/:id', (req,res) => {
//   Event
//     .findById(req.params._id)
//     .populate('expenses')
//     .exec()
//     .then(expenses => {
//       return res.json(expenses)
//     })
//     .catch(err => {
//       console.log(err);
//       return res.status(500).json({message: 'internal server error'});
//     });
// });

//DELETE - CREATE DELETE REQUEST USING FIND BY ID: // ON SCRIPT.JS WRITE A FUNCTION THAT TRIGGERS THAT SPECIFIC ID/ELEMENT TO BE REMOVED FROM DOM

app.delete('/events/:id', (req, res) => {
  Event
   .findByIdAndRemove(req.params.id)
   .then(event =>
     res.status(204).end())
   .catch(err =>
     console.log(err)
     // res.status(500).json({message:'Internal server error'})
   );

})

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
//runServer is expecting two parameters
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
