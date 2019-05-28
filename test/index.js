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

/////-------------------------////
describe('Expenses', function(){

  it('create an expense item on POST', function(){
    return chai.request(app)
    .post('/expenses')
    .then(function(res){
      //can have several expectations, but won't pass until they all pass
      expect(res).to.have.status(400);
      expect(res.body).to.be.a('object');
      expect(res.body.id).to.not.equal(null);
    });
  });
});
//////---------------------------------/////


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

    it('GET should return list of events', function(){
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

    describe('postEvents', function(){

      it('should add event item on POST', function(){
        return chai.request(app)
        .post('/events')
        .then(function(res){
          //can have several expectations, but won't pass until they all pass
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.not.equal(null);
        });
      });
    });

    describe('deleteEvents', function(){
/////////////figure this out. why is line 93 returning undefined?? //////////////
      it('should delete event item on DELETE', function(){
        return chai.request(app)
        fetch(`http://localhost:8080/events`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ id: deletedEventID})
        })
        .then(function(response){
            post('/events')
            .then(function(res){

              return chai.request(app)
                .delete(`/events/:id/${response.body[0].id}`);
                console.log(res.body[0].id);
                console.log(res.body[0]._id);
            })
            .then(function(res){
              expect(res).to.have.status(204);
            });
        });
      });


    });

    // });
