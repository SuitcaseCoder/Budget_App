//define what the data will look like
//make models for expenses as well
//model builds out the structure


const mongoose = require('mongoose');

const eventSchema = mongooseSchema({
    title: {type: String, required: true},
    date: {type: Date, required: false,},
    budget: {type: Number, required: true},
    //expenses will be an array of objects
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref:'Expense'}]
});

const expenseSchema = mongooseSchema({
  title: {type: String, required: true},
  percentage: {type: Number}
})

const events = mongoose.model('Event', eventSchema);
