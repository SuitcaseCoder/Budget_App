//define what the data will look like
//make models for expenses as well
//model builds out the structure


const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    date: {type: Date, required: false,},
    budget: {type: Number, required: true},
    //expenses will be an array of objects
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref:'Expense'}]
});

const expenseSchema = mongoose.Schema({
  title: {type: String, required: true},
  percentage: {type: Number}
});

const Event = mongoose.model('Event', eventSchema);
const Expense = mongoose.model('Expense', expenseSchema);


module.exports = {Event};
module.exports = {Expense}
