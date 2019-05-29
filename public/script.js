
let globalData = '';
let selectedEvent = '';
let eventSelectedID = '';
let remainingBudget = 0;
let sumOfExpenses = 0;
let expenseBudget = 0;


//RENDERS EVENTS TO DOM
function appendToDOM(){
  const eventsHTML = generateEventsHTML();
    $('main').html(eventsHTML);
}

//GENERATES EVENTS SECTION & CALLS FOR EACH EVENT TO BE DISPLAYED AS LI
//DISPLAYS EVENTS (NAME CHANGE TO displayEvents?)
function generateEventsHTML() {
  const eventItems = globalData.map(event => {
    return generateEventItemHTML(event);
  }).join('');
  return `<section class='events'>
        <h3>Events</h3>
        <input class="addEventButton" id="addEventButton" type="button" value="+" role="button">Add Event</input>
        <ul class="eventItemsList">
        ${eventItems}
        </ul>
      </section>`;
}

//GENERATES EACH EVENT AS A LIST ITEM
function generateEventItemHTML(eventsData) {
  return `<li class="eventItem" id="${eventsData.title}" data-id="${eventsData._id}">
      <p>${eventsData.title}</p>
      <p>${eventsData.date}</p>
      <p>Budget: $${eventsData.budget}</p>
      <button role="button" id="eventDeleteButton">delete Event</button>
    </li>`;
}

//RENDER NEW EVENT ITEM AFTER POST TO API MADE (CHANGE NAME TO displayEventAdded) --IS THIS EVEN USED?
function renderNewEventCreated(updatedEventsData){
  $('.eventItemsList').append(`
    <li class="eventItem" id="${updatedEventsData.title}" data-id="${updatedEventsData._id}">
        <p>${updatedEventsData.title}</p>
        <p>${updatedEventsData .date}</p>
        <p>Budget: $${updatedEventsData.budget}</p>
      </li>
    `)
}

//CHANGE SCREENS

//LISTENS FOR EVENT SELECTED & CALLS FOR PAGE REPLACEMENT
function listenEventSelected(){
  $('main').on('click', 'li', function(e){
    eventSelectedID = $(this).attr('data-id');
    selectedEvent = $(this).attr('id');
    replaceHTML(selectedEvent,eventSelectedID);
  });
}

//RENDERS EVENT'S EXPENSE PAGE. CALLS FOR TOTBUDSECTION & EXPENSELIST SECTION.
function replaceHTML(selectedEvent, eventSelectedID){
  let totalBudgetSection = generateTotBudSection(selectedEvent);
  let expenseList = generateExpenseSection(selectedEvent, eventSelectedID);
  $('main').html(``);
  $('main').append(totalBudgetSection);
  $('main').append(expenseList);
  handleAddExpenseButton(eventSelectedID);
//----------------- NOTE CHANGE ---------------------
listenSliderChange({target: null});
  // handleSliderChange({target: null}, eventSelectedID);
}

//GENERATES TOTAL BUDGET SECTION HTML
function generateTotBudSection(selectedEvent){
  let displayBudget = globalData.find(event => event.title === selectedEvent).budget;
  return `
    <section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Current Budget for ${selectedEvent}: $${displayBudget}</h3>
      <h3 id='remainingBudget'></h3>
    </section>`;
}

// HOLDS EXPENSE LIST SECTION HTML & CALLS FOR EACH EXPENSE TO BE SHOWN
function generateExpenseSection(selectedEvent, eventSelectedID){
  renderExpenseItems2(selectedEvent, eventSelectedID)
  return `
  <section class="expenses">
  <div id="remainingBudger"></div>
    <h3>Expenses</h3>
    <p id="currentSum"></p>
    <button class="addExpenseButton" id="addExpenseButton" type="button" value="+" role="button">Add Expense</button>
  </section>`
}

//DISPLAYS LIST OF EXPENSES
function renderExpenseItems2(selectedEvent, eventSelectedID) {
  const expenseItems = globalData.find(event => event.title === selectedEvent).expenses;
  const eachExpense = expenseItems.map(expenseItem =>
    {return generateExpenseItemDetails(expenseItem, eventSelectedID)}).join('');
    sumExpenses();
    calcRemainingBudget();
  return returnExpenseList(eachExpense);
}

// GENERATES/DISPLAYS EXPENSE DETAILS
function generateExpenseItemDetails(expense, eventSelectedID) {
  let percentVal = expense.percentage;
  return `
    <li class="subCatItem">
      <p>${expense.title}</p>
      ${generateSlider(expense,percentVal)}
      <p id="${expense.title}" data-id="${calculateExpenseAmt(percentVal, eventSelectedID)}">\$${calculateExpenseAmt(percentVal, eventSelectedID)}</p>
    </li>`;
}

// GENERATES SLIDER
function generateSlider(expense,percentVal){
  console.log(expense);
  return `<div id="${expense._id}" class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="${percentVal}" class="slider" id="myRange">
      <label for="slider">${percentVal}% of budget</label>
    </div>`;
}

//CALCULATES EXPENSE AMOUNT BASED ON INPUTS AND CHANGES
function calculateExpenseAmt(percentVal,eventSelectedID){

  ids = globalData.map(function(event) {
    return event._id
  });
  expenseBudget = globalData.find(event => event._id === eventSelectedID).budget;
  let expenseTypeAmt = expenseBudget * (percentVal / 100);
  return Math.floor(expenseTypeAmt);
}

function returnExpenseList(eachExpense){
  return $('body').append(`
    <ul class="expenseListSection">
      ${eachExpense}
    </ul>
`);
}

function listenSliderChange(domEvent){
    // GET CURRENT SLIDER INFO
    let target = domEvent.target
    const nameOfExpense = $(target).closest('div').attr('id');

    const valOfSlider = $(target).val();
    updateSliderVal(valOfSlider,nameOfExpense);
    recalculateExpenseAmt(valOfSlider,target);
    sumExpenses();
    calcRemainingBudget();
}


function sumExpenses(){
  let expensesTotal = [];
  $('input[type="range"]').each(function(){
    expensesTotal.push($(this).parent().parent().children('p').last().attr('data-id'));
    sumOfExpenses =
    expensesTotal.reduce((a, b) => parseFloat(a) + parseFloat(b));
  })
}

function calcRemainingBudget(){
  $('#currentSum').html(`current expense total is: $${sumOfExpenses}`);

    remainingBudget = expenseBudget - sumOfExpenses;

    if (remainingBudget < 0 ){
      $('#remainingBudget').css('color','#E52A6F');

      return $('#remainingBudget').html("You are OVER budget, please re-adjust your expenses");

    } else {
      $(this).css('color','#5F0F4e')
      $('#remainingBudget').css('color','#5F0F4e')
      return $('#remainingBudget').html("You are still UNDER budget");
    }
}

//DISPLAYS THE SLIDER'S CHANGED VALUE ACCURATELY
function updateSliderVal(valOfSlider, nameOfExpense){
  $('input[type="range"]').each(function(){
    // IF ITS THE SLIDER BEING CHANGED, UPDATE THE LABEL
    if($(this).closest('div').attr('id')==nameOfExpense){
    $(this).siblings('label').text($(this).val()+ '% of budget');
    $(this).closest('input').attr('value', $(this).val());
  }
})
}

function recalculateExpenseAmt(valOfSlider,target){

  let currentEventBud = globalData.find(event => event.title === selectedEvent).budget;
  let recalculatedAmt = (currentEventBud * (valOfSlider / 100));
  return Math.floor(updateExpAmt(recalculatedAmt,target));
}

function updateExpAmt(recalculatedAmt,target){
  const newExpAmt = $(target).parent().parent().children('p').last().text('$' + recalculatedAmt);
  const heyThere = $(target).parent().parent().children('p').last().attr('data-id',recalculatedAmt);

}
//IS THIS EVEN CALLED FOR?
// function renderExpenseItems(eventSelectedID) {
//   renderExpenseList();
//   handleTotBudChange();
// }


//HANDLES ADD EXPENSE BUTTON
function handleAddExpenseButton(eventSelectedID){
  $('#addExpenseButton').on('click', function(e){
    generateAddExpenseForm(eventSelectedID);
    handleExpenseSubmitButton(eventSelectedID);
  })
}


//
function renderNewExpenseCreated(expenseCreatedDetails,eventSelectedID){
  console.log(expenseCreatedDetails);
let newExpenses = expenseCreatedDetails;
console.log(newExpenses.percentage);
  $('.expenseListSection').append(
  `
    <li class="subCatItem">
      <p>${newExpenses.title}</p>
      ${generateSlider(newExpenses, newExpenses.percentage)}
      <p id="${newExpenses.title}">\$${calculateExpenseAmt(newExpenses.percentage, eventSelectedID)}</p>
    </li>`);
}

// //HANDLES CHANGES TO THE TOTAL BUDGET
// function handleTotBudChange(){
//   $('input[type="number"]').on('change', function(e){
//     const val = $(this).val();
//     //make this accurate
//     //probably have to change selectedEVent here
//     globalData.events = globalData.events.map(el => {
//       if (el.title == selectedEvent){
//         el.budget = val;
//       }
//       return el;
//     });
//       renderExpenseItems2();
//   })
// }


// + BUTTONS

// HANDLES ADD EVENT BUTTON
function handleAddEventButton(){
  $('body').on('click', '#addEventButton', function(e){
    generateAddEventForm();
  })
}

//HANDLES SUBMIT EXPENSE BUTTON
function handleExpenseSubmitButton(eventSelectedID){
  $('.expenseForm').on('submit', function(e){
    e.preventDefault(e);
    const newExpenseData = getNewExpenseInputVals(eventSelectedID);
    expensePOSTRequest(newExpenseData, eventSelectedID);
  })
}

// GETS INPUT VALUES OF EXPENSE ADDED
function getNewExpenseInputVals(eventSelectedID){
  let newExpenseTitle = $('#expenseTitle').val();
  let newExpensePercentage = $('#expensePercentage').val();

  let newExpenseData = {
    title: newExpenseTitle,
    percentage: newExpensePercentage,
    event: eventSelectedID
  };

  return newExpenseData

}

//DISPLAYS ADD EVENT FORM
function generateAddEventForm(){
  $('main').append(`
    <div class="eventFormDiv">
      <form role="form" class="eventForm">
        <div>
          <label for="eventTitle">Name your event:</label>
          <input type="text"  id="eventTitle">
        </div>
        <div>
          <label for="eventDate">Date of your event:</label>
          <input type="date"  id="eventDate">
        </div>
        <div>
          <label for="eventBudget">Budget for your event: $</label>
          <input type="number"  id="eventBudget">
        </div>
        <input class="submitEventButton" id="submitNewEvent" type="submit" value="Submit Event" role="button">
      </form>
    </div> `)
    onNewEventSubmit();
}

// HANDLES NEW EVENT BUTTON
function onNewEventSubmit(){
  $('form').on('click', '#submitNewEvent', function(e){
    e.preventDefault(e);
    getNewEventInputVals();
  });
}

//COLLECTS INPUT VALUES OF EVENT ADDED
function getNewEventInputVals(){
    let newEventTitle = $('#eventTitle').val();
    let newEventDate = $('#eventDate').val();
    let newEventBudget = $('#eventBudget').val();

    let postRequestData = {
      title: newEventTitle,
      date: newEventDate,
      budget: newEventBudget
    };

    callAPIPOST(postRequestData);
}

// CALL TO API TO GET ALL EVENTS
function fetchGET(){
  fetch('/events')
  .then(res => res.json())
  .then(newResponse => {
    globalData = newResponse;
    appendToDOM();
  })
  .catch(error => console.log(error))
}

// POST CALL TO ADD NEW EVENT TO DB
function callAPIPOST(postRequestData){
  fetch('/events', {
      method: 'POST',
      body: JSON.stringify(postRequestData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(response => response.json())
  .then(newResponse =>
  renderNewEventCreated(newResponse)
    // generateEventItemHTML(newResponse)
  )
  .catch(error => console.log(error))
}

// CALL TO API TO GET DB AFTER NEW EXPENSE HAS BEEN ADDED
// function fetchDBNewExpenses(eventSelectedID){
//   console.log(eventSelectedID);
//   fetch(`http://localhost:8080/events/${eventSelectedID}`)
//   .then(res => res.json())
//   .then(newResponse => {
//     console.log(newResponse)
//     // globalData = newResponse;
//     // replaceHTML();
//   })
//   .catch(error => console.log(error))
// }

//DISPLAYS ADD EXPENSE FORM
function generateAddExpenseForm(eventSelectedID){
  //html for event form ONLY
  $('main').append(`
    <div class="expenseFormDiv" data-id="${eventSelectedID}">
      <form role="form" class="expenseForm">
        <div>
          <label for="expenseTitle">Name your Expense:</label>
          <input type="text"  id="expenseTitle">
        </div>
        <div>
          <label for="expensePercentage">Expense Percentage:</label>
          <input type="number"  id="expensePercentage">
        </div>
        <input class="submitExpenseButton" id="submitNewExpense" type="submit" value="Submit Expense" role="button">
      </form>
    </div>
    `)
}


//DELETE EVENT
function onDeleteEventItem(){
  $('main').on('click', '#eventDeleteButton', function(eventItem) {
    eventItem.stopPropagation();
    const deletedEventID = $(this).parent().attr('data-id')
    console.log(deletedEventID);
    deleteEventRequest(deletedEventID);
  })
}

function deleteEventRequest(deletedEventID){
  console.log(deletedEventID);
  fetch(`/events/${deletedEventID}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ id: deletedEventID})
  })
  .then(res => {
    if (res.status == 204){
      fetchGET();
    }
  }
    )
    .catch(console.log);
    // res.json())
}

// POST REQUEST TO ADD NEW EXPENSE
function expensePOSTRequest(newExpenseData,eventSelectedID){
  fetch(`/expenses`, {
      method: 'POST',
      body: JSON.stringify(newExpenseData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(response =>{
    return response.json();
  })
    // response.json())
  .then(expenseCreatedDetails =>
    renderNewExpenseCreated(expenseCreatedDetails,eventSelectedID))
    // replaceHTML())
    // renderExpenseItems2(expenseCreatedDetails, eventSelectedID))
  .catch(error => console.log(error))
}

//
$(() => {
  fetchGET();
  onDeleteEventItem();
  listenEventSelected();
  handleAddEventButton();

  $('body').on('change', 'input[type="range"]', function(e) {
listenSliderChange(e);
    // handleSliderChange(e);
  })
});
