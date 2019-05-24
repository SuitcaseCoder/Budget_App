
let globalData = '';
let selectedEvent = '';

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
    let eventSelectedID = $(this).attr('data-id');
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
  handleSliderChange({target: null}, eventSelectedID);
}

//GENERATES TOTAL BUDGET SECTION HTML
function generateTotBudSection(selectedEvent){
  let displayBudget = globalData.find(event => event.title === selectedEvent).budget;
  console.log(displayBudget);
  return `
    <section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Current Budget for ${selectedEvent}: $${displayBudget}</h3>
        <label for="totalBudget">What's your budget?:</label>
        <input type="number" id="totBudget" name="totalBudget"
              min="10">
    </section>`;
}

// HOLDS EXPENSE LIST SECTION HTML & CALLS FOR EACH EXPENSE TO BE SHOWN
function generateExpenseSection(selectedEvent, eventSelectedID){
// -------------------- NOTE CHANGE: renderExpenseItems2 IS NOW CALLED BEFORE THIS RETURNS TO REMOVE UNDEFINED/[OBJECT,OBJECT]----------------------
  renderExpenseItems2(selectedEvent, eventSelectedID)

  return `
  <section class="expenses">
    <h3>Expenses</h3>
    <button class="addExpenseButton" id="addExpenseButton" type="button" value="+" role="button">Add Expense</button>
  </section>`
}

//IS THIS EVEN CALLED FOR?
function renderExpenseItems(eventSelectedID) {
  renderExpenseList();
  handleTotBudChange();
}

//HANDLES CHANGES TO SLIDER (AKA PERCENTAGE)
//------- NOTE CHANGE: NOW CALLS FOR 'domEvent & event_id' ----------
function handleSliderChange(domEvent, event_id){
  // GET CURRENT SLIDER INFO
  // domeEvent.target returns the element that triggered the event
  let target = domEvent.target
  console.log(target);
  const nameOfExpense = $(target).closest('div').attr('id');
  console.log(nameOfExpense);
  const valOfSlider = $(target).val();
  console.log(valOfSlider);

  //SYNCING UP ALL PERCENTAGES
  $(target).siblings('label').text(valOfSlider + '% of budget')
    // globalData.find(event => event._id === eventSelectedID).budget;
    // globalData.find(event => event.title === selectedEvent).expenses[name].percentage = val/100;

  //CALCULATING NEW PERCENTAGE FOR EACH OF THE EXPENSES
  if (!event_id)
    event_id = $(target).parents('li').data('eventId');
  let expItems = globalData.find(event => event._id === event_id).expenses;
  console.log(expItems);
  let expPercentage = expItems.map(exp => {
    return exp.percentage = valOfSlider / 100
  });

  //VALIDATION SO PERCENTAGES DON'T SURPASS TOTAL OF 100
  let remainingPercentage = 100 - valOfSlider;
  console.log(remainingPercentage);

  // ITERATE OVER EACH SLIDER
    $('input[type="range"]').each(function(){

      //IF ITS NOT THE SLIDER THAT WAS JUST CHANGED
      if($(this).closest('div').attr('id')!==nameOfExpense){

        //AND IF ITS GREATER THAN 100
        if($(this).val()>=remainingPercentage){

          //CHANGE SO THAT THIS VALUE AND THE CHANGED ONE == 100
          $(this).val(remainingPercentage);
          remainingPercentage = 0;

        } else

          remainingPercentage -= $(this).val();

        $(this).siblings('label').text($(this).val()+ '% of budget');
      }
    });

    console.log(valOfSlider);
    $(`#${nameOfExpense}-value`).text(calculateExpenseAmt(valOfSlider / 100 , event_id));
}

//CALCULATES EXPENSE AMOUNT BASED ON INPUTS AND CHANGES
function calculateExpenseAmt(percentVal,eventSelectedID){
  console.log(percentVal);
  ids = globalData.map(function(event) {
    return event._id
  });
  let expenseBudget = globalData.find(event => event._id === eventSelectedID).budget;
  console.log(expenseBudget);
  let expenseTypeAmt = expenseBudget * (percentVal / 100);
  console.log(Math.floor(expenseTypeAmt));
  return Math.floor(expenseTypeAmt);
}

//DISPLAYS LIST OF EXPENSES
function renderExpenseItems2(selectedEvent, eventSelectedID) {
  const expenseItems = globalData.find(event => event.title === selectedEvent).expenses;
  const eachExpense = expenseItems.map(expenseItem =>
    {return generateExpenseItemDetails(expenseItem, eventSelectedID)}).join('');

  return returnExpenseList(eachExpense);
}

function returnExpenseList(eachExpense){
  return $('body').append(`
    <ul class="expenseListSection">
      ${eachExpense}
    </ul>
`);
}

//HANDLES ADD EXPENSE BUTTON
function handleAddExpenseButton(eventSelectedID){
  $('#addExpenseButton').on('click', function(e){
    generateAddExpenseForm(eventSelectedID);
    handleExpenseSubmitButton(eventSelectedID);
  })
}

// GENERATES/DISPLAYS EXPENSE DETAILS
function generateExpenseItemDetails(expense, eventSelectedID) {
  let percentVal = expense.percentage;
  return `
    <li class="subCatItem">
      <p>${expense.title}</p>
      ${generateSlider(expense,percentVal)}
      <p id="${expense.title}">\$${calculateExpenseAmt(percentVal, eventSelectedID)}</p>
    </li>`;
}
//
// function renderNewExpenseCreated(expenseCreatedDetails,eventSelectedID){
// let newExpenses = (globalData.find(event => event._id === eventSelectedID).expenses)
//   $('.expenseListSection').append(
//   `
//     <li class="subCatItem">
//       <p>${newExpenses.title}</p>
//       ${generateSlider(newExpenses)}
//       <p id="${newExpenses.title}">\$${calculateExpenseAmt()}</p>
//     </li>`);
// }

// GENERATES SLIDER
function generateSlider(expense,percentVal){
  console.log(percentVal);
  return `<div id="${expense._id}" class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="${percentVal}" class="slider" id="myRange">
      <label for="slider">${percentVal}% of budget</label>
    </div>`;
}

//HANDLES CHANGES TO THE TOTAL BUDGET
function handleTotBudChange(){
  $('input[type="number"]').on('change', function(e){
    const val = $(this).val();
    //make this accurate
    //probably have to change selectedEVent here
    globalData.events = globalData.events.map(el => {
      if (el.title == selectedEvent){
        el.budget = val;
      }
      return el;
    });
      renderExpenseItems2();
  })
}

// + BUTTONS

// HANDLES ADD EVENT BUTTON
function handleAddEventButton(){
  $('body').on('click', '#addEventButton', function(e){
    generateAddEventForm();
  })
}

//HANDLES SUBMIT EXPENSE BUTTON
function handleExpenseSubmitButton(eventSelectedID){
  //target that form and change to submit
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
  //html for event form ONLY
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
  fetch('http://localhost:8080/events')
  .then(res => res.json())
  .then(newResponse => {
    globalData = newResponse;
    appendToDOM();
  })
  .catch(error => console.log(error))
}

// POST CALL TO ADD NEW EVENT TO DB
function callAPIPOST(postRequestData){
  fetch('http://localhost:8080/events', {
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
  $('main').on('click', '#eventDeleteButton', eventItem => {
    deleteEventRequest(eventItem);
    console.log(eventItem);

  })
}

function deleteEventRequest(eventItem){
  //I NEED TO PASS THE ID OF THE EVENT I'M CLICKING TO DELETE THE EVENT I'M CLICKING ON
  console.log(eventItem);
  fetch('http://localhost:8080/events/:id', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(eventItem)
  })
  .then(res => res.json())
  .then(res => console.log(res))
}

// POST REQUEST TO ADD NEW EXPENSE
function expensePOSTRequest(newExpenseData,eventSelectedID){
  fetch(`http://localhost:8080/expenses`, {
      method: 'POST',
      body: JSON.stringify(newExpenseData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(response => response.json())
  .then(expenseCreatedDetails =>
    // console.log(expenseCreatedDetails))
    replaceHTML())
    // renderNewExpenseCreated(expenseCreatedDetails,eventSelectedID))
  .catch(error => console.log(error))
}

//
$(() => {
  fetchGET();
  onDeleteEventItem();
  listenEventSelected();
  handleAddEventButton();

  $('body').on('change', 'input[type="range"]', function(e) {
    handleSliderChange(e);
  })
});
