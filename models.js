//define what the data will look like
//make models for expenses as well
//model builds out the structure


const mongoose = require('mongoose');

const eventsSchema = mongooseSchema({
  events: [{
    eventTitle: {type: String, required: true},
    eventDate: {type: Date, required: false,},
    eventBudget: {type: Number, required: true},
    expenses: [{
      expenseTitle: {type: String, required: true},
      percentage: {type: Number}
    }]
  }]
});
