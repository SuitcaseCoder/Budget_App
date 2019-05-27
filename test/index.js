const chai = require('chai');
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server');
// .. means its in the parents directory
const {PORT, TEST_DATABASE_URL} = require('../config');


//do I have to require mocha?
//const mocha = require('mocha');
const expect = chai.expect;

chai.use(chaiHttp);

//how do I test for my root URL instead of like a /users endpoint?
//Also, I'm setting up the testing before actually creating my CRUD operations...right?

//describe is a part of chai and it basically starts off the test?
before(function() {
  return runServer(PORT, TEST_DATABASE_URL);
});

after(function() {
  return closeServer();
});

describe('rootUrl', function(){

  it('should get status 200', function(){
      return chai.request(app)
      .get('/')
      .then(function(res){
        //can have several expectations, but won't pass until they all pass
        expect(res).to.have.status(200);
        // expect(res).to.be.json;
      })
    });

});

describe('Events', function(){
  describe('getEvents', function(){

    it('should work', function(){
      return chai.request(app)
      .get('/events')
      .then(function(res){
        //can have several expectations, but won't pass until they all pass
        expect(res).to.have.status(200);
        // expect(res).to.be.json;
      })
    });

    it('should return list of events', function(){
      return chai.request(app)
      .get('/events')
      .then(function(res){
        //can have several expectations, but won't pass until they all pass
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        res.body.forEach(function(item){
        expect(item).to.be.a('object');
        expect(item).to.have.keys(
          'title', 'date', 'budget', 'expenses');
        });
      })
    });

  });

});
