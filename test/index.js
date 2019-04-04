const chai = require('chai');
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server');


//do I have to require mocha?
//const mocha = require('mocha');
const expect = chai.expect;

chai.use(chaiHttp);

//how do I test for my root URL instead of like a /users endpoint?
//Also, I'm setting up the testing before actually creating my CRUD operations...right?

//describe is a part of chai and it basically starts off the test?
describe('rootUrl', function(){

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should get status 200', function(){
      return chai.request(app)
      .get('/')
      .then(function(res){
        expect(res).to.have.status(200);
        // expect(res).to.be.json;
      })
    });

});
