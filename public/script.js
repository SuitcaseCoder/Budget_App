
let globalData = '';
let selectedEvent = '';

// APPENDS LIST OF EVENTS FROM DB TO PAGE
function appendToDOM(){
  const eventsHTML = generateEventsHTML();
    $('main').html(eventsHTML);
}

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

//GENERATES EVENT ITEMS
function generateEventItemHTML(eventsData) {
  return `<li class="eventItem" id="${eventsData.title}" data-id="${eventsData._id}">
      <p>${eventsData.title}</p>
      <p>${eventsData.date}</p>
      <p>Budget: $${eventsData.budget}</p>
    </li>`;
}

//RENDER NEW EVENT ITEM AFTER POST TO API MADE (CHANGE NAME TO displayEventAdded)
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
    // I TOOK OFF 'LET' FROM HERE, SHOULD IT GO BACK?
     selectedEvent = $(this).attr('id');
    replaceHTML(selectedEvent,eventSelectedID);
    // fetchGETExpense(selectedEvent, eventSelectedID);
  });
}

//DISPLAYS EVENT'S EXPENSE PAGE SHOULD IT REPLACE MAIN AND APPEND EACH SECTION TO THE MAIN SECTION?
function replaceHTML(selectedEvent, eventSelectedID){
  let totalBudgetSection = generateTotBudSection(selectedEvent);
  let expenseList = generateExpenseSection(selectedEvent, eventSelectedID);
  $('main').html(``);
  $('main').append(totalBudgetSection);
  $('main').append(expenseList);
}

function generateTotBudSection(selectedEvent){
  return `
    <section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Visualize your budget for your upcoming ${selectedEvent}</h3>
        <label for="totalBudget">What's your budget?:</label>
        <input type="number" id="totBudget" name="totalBudget"
              min="10">
    </section>`;
}


function generateExpenseSection(selectedEvent, eventSelectedID){
  return `
  <section class="expenses">
    <h3>Expenses</h3>
    <input class="addExpenseButton" id="addExpenseButton" type="button" value="+" role="button">Add Expense</input>
    <ul class="expenseListSection">
    ${renderExpenseItems2(selectedEvent, eventSelectedID)}
    </ul>
  </section>`
}

// function replaceHTML(selectedEvent, eventSelectedID){
//   let budgetPageHTML = generateTotalBudgetHTML(selectedEvent);
//   $('main').html(`
//     <section id="budgetPageSection"></section>`);
//   $('#budgetPageSection').append(budgetPageHTML);
//   renderExpenseItems(eventSelectedID);
// }

//RETURNS HTML FOR TOP SECTION OF EVENT'S EXPENSE PAGE
// function generateTotalBudgetHTML(selectedEvent, eventSelectedID){
//   return `
//     <section class="totBud">
//       <h2>${selectedEvent}</h2>
//       <h3>Visualize your budget for your upcoming ${selectedEvent}</h3>
//         <label for="totalBudget">What's your budget?:</label>
//         <input type="number" id="totBudget" name="totalBudget"
//               min="10">
//     </section>`;
// };

//DOES WAY TOO MUCH
//HANDLES ADD EXPENSE BUTTONS
//RENDERS EXPENSE LIST AND LIST ITEMS TWICE (WHY)
//HANDLES SLIDER CHANGE AND TOT BUD CHANGES
function renderExpenseItems(eventSelectedID) {
  handleAddExpenseButton(eventSelectedID)
  renderExpenseList()
  handleSliderChange();
  handleTotBudChange()
}

//HANDLES CHANGES TO SLIDER (AKA PERCENTAGE)
function handleSliderChange(){
  $('body').on('change','input[type="range"]', function(e) {
    const name = $(this).closest('div').attr('id');
    const val = $(this).val();
    $(this).siblings('label').text(val+ '% of budget')
    // console.log(JSON.stringify(data.events));
    data.events.find(event => event.name === selectedEvent).expenses[name].percentage = val/100;
    // console.log(JSON.stringify(data.events));

    let remainingPercentage = 100 - val;
    $('input[type="range"]').each(function(){
      if($(this).closest('div').attr('id')!==name){
        if($(this).val()>=remainingPercentage){
          $(this).val(remainingPercentage);
          remainingPercentage = 0;
        } else {
          remainingPercentage -= $(this).val();
        }
        $(this).siblings('label').text($(this).val()+ '% of budget');
      }
    });
    $(`#${name}-value`).text(calculateExpenseAmt(val/100));
  })
}

//CALCULATES EXPENSE AMOUNT BASED ON INPUTS AND CHANGES
function calculateExpenseAmt(expense,percentVal,eventSelectedID){
  //EXPENSE BUDGET SHOULD BE THE CURRENT BUDGET FOR SELECETED EVENT'S EXPENSE not the percentage, right?

// expense.map(testingSomething => {
//   if (testingSomething.)
// })
  console.log(eventSelectedID);
  //here: if event = eventSelectedID === eventSelectedID then return .budget

  let expenseBudget = globalData.find(event => event._id === eventSelectedID).budget;
  console.log(expenseBudget);
  let expenseTypeAmt = expenseBudget*percentVal;
  console.log(expenseTypeAmt);
  return Math.floor(expenseTypeAmt);
}

//DISPLAYS LIST OF EXPENSES
function renderExpenseItems2(selectedEvent, eventSelectedID) {
  const expenseItems = globalData.find(event => event.title === selectedEvent).expenses;
  const eachExpense = expenseItems.map(expenseItem =>
    {return generateExpenseItemDetails(expenseItem, eventSelectedID)}).join('');

returnExpenseList(eachExpense);
}

function returnExpenseList(eachExpense){
  console.log(eachExpense);
  return $('.main').append(`
    <ul>
      ${eachExpense}
    </ul>
`);
console.log('made it here');
}

// DISPLAYS EXPENSE SECTION AND ADD EXPENSE BUTTON
function renderExpenseList(){
  return `
  <section class='expenses'>
    <h3>Expenses</h3>
    <input class="addExpenseButton" id="addExpenseButton" type="button" value="+" role="button">Add Expense</input>
  </section>`
}

//HANDLES ADD EXPENSE BUTTON
function handleAddExpenseButton(eventSelectedID){
  $('body').on('click', '#addExpenseButton', function(e){
    e.preventDefault();
    generateAddExpenseForm(eventSelectedID);
    handleExpenseSubmitButton(eventSelectedID);
  })
}

// GENERATES/DISPLAYS EXPENSE DETAILS
function generateExpenseItemDetails(expense, eventSelectedID) {
  console.log(eventSelectedID);
  let percentVal = expense.percentage;
  return `
    <li class="subCatItem">
      <p>${expense.title}</p>
      ${generateSlider(expense,percentVal)}
      <p id="${expense.title}">\$${calculateExpenseAmt(expense,percentVal, eventSelectedID)}</p>
    </li>`;
}

// GENERATES SLIDER
function generateSlider(expense,percentVal){
  console.log(percentVal);
  return `<div id="${expense.title}" class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="${percentVal*100}" class="slider" id="myRange">
      <label for="slider">percent of budget</label>
    </div>`;
}

//HANDLES CHANGES TO THE TOTAL BUDGET
function handleTotBudChange(){
  $('input[type="number"]').on('change', function(e){
    const val = $(this).val();
    data.events = data.events.map(el => {
      if (el.name == selectedEvent){
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
  //target that form and change t submit
  $('form').on('click', '#submitNewExpense', function(e){
    e.preventDefault(e);
    getNewExpenseInputVals(eventSelectedID);
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

  // console.log(newExpenseData);
  expensePOSTRequest(newExpenseData, eventSelectedID);
  //after the post usually, nothing gets called afterward so find a good spot for fetGETrequest
  // callAPIPOST(postRequestData);
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
    console.log(globalData);
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
    <div class="expenseFormDiv" data-id"${eventSelectedID}">
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
  .then(newResponse =>
    console.log(newResponse)
    // fetchGETExpense(newResponse, eventSelectedID)
// renderExpenseItems2(newResponse)
    // generateEventItemHTML(newResponse)
  )
  .catch(error => console.log(error))
}

//
$(fetchGET());
$(listenEventSelected());
$(handleAddEventButton());
