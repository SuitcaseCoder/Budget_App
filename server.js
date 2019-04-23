const express = require('express');
const app = express();
const port = 8080

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
      reject(err);
    });
  });
}

// app.get('/', (req,res) => res.send({
//   console.log('hey hey');
//   message: 'hey hey app.get is i think working',
//   color: 'pink'
// }))
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
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, closeServer, app}
