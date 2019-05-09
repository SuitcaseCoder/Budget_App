const data = {
  events: [
    {
      name: 'Marathon Weekend',
      date:'September 14, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'food',
          percentage: 0
        },
        'transportation': {
          name: 'transportation',
          percentage: 0
        },
        'accomodation':{
          name: 'accomodation',
          percentage: 0
        }
      }
    },
    {
      name: 'Surprise Party',
      date:'May 28, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'food',
          percentage: 0
        },
        'transportation': {
          name: 'transportation',
          percentage: 0
        },
        'accomodation':{
          name: 'accomodation',
          percentage: 0
        }
      }
    },
    {
      name: 'Camping Trip',
      date: 'August 23, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'food',
          percentage: 0
        },
        'transportation': {
          name: 'transportation',
          percentage: 0
        },
        'accomodation':{
          name: 'accomodation',
          percentage: 0
        }
      }
    },
    {
      name: 'Photography Workshop',
      date: 'October 22, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'food',
          percentage: 0
        },
        'transportation': {
          name: 'transportation',
          percentage: 0
        },
        'accomodation':{
          name: 'accomodation',
          percentage: 0
        }
      }
    }
  ],
  users: [
    {
      name: 'Fritz',
      age:16,
      username: 'fritz-o-polous'
    },
    {
      name: 'Rosie',
      age: 8,
      username: 'elGatoVolador'
    },
    {
      name: 'Shiner',
      age: 7,
      username: 'shi_Shi'
    }
  ],
};

let selectedEvent = '';

// APPENDS LIST OF EVENTS FROM DB TO PAGE
function appendToDOM(data){
  const eventsHTML = generateEventsHTML(data);
    $('main').html(eventsHTML);
}

//DISPLAYS EVENTS (NAME CHANGE TO displayEvents?)
function generateEventsHTML(newResponse) {
  const eventItems = newResponse.map(event => {
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
    e.preventDefault();
    let eventSelectedID = $(this).attr('data-id');
    let selectedEvent = $(this).attr('id');
    replaceHTML(selectedEvent, eventSelectedID);
  });
}

//DISPLAYS EVENT'S EXPENSE PAGE SHOULD IT REPLACE MAIN AND APPEND EACH SECTION TO THE MAIN SECTION?
function replaceHTML(selectedEvent, eventSelectedID){
  let budgetPageHTML = generateTotalBudgetHTML(selectedEvent);
  $('main').html(`
    <section id="budgetPageSection"></section>`);
  $('#budgetPageSection').append(budgetPageHTML);
  renderExpenseItems(eventSelectedID);
}

//RETURNS HTML FOR TOP SECTION OF EVENT'S EXPENSE PAGE
function generateTotalBudgetHTML(selectedEvent, eventSelectedID){
  return `
    <section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Visualize your budget for your upcoming ${selectedEvent}</h3>
        <label for="totalBudget">What's your budget?:</label>
        <input type="number" id="totBudget" name="totalBudget"
              min="10">
    </section>`;
};

//DOES WAY TOO MUCH
//HANDLES ADD EXPENSE BUTTONS
//RENDERS EXPENSE LIST AND LIST ITEMS TWICE (WHY)
//HANDLES SLIDER CHANGE AND TOT BUD CHANGES
function renderExpenseItems(eventSelectedID) {
  handleAddExpenseButton(eventSelectedID)
  renderExpenseList()
  // renderExpenseItems2();
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
function calculateExpenseAmt(percentage){
  let expenseBudget = data.events.find(event => event.name === selectedEvent).budget;
  let expenseTypeAmt = expenseBudget*percentage;
  return Math.floor(expenseTypeAmt);
}

//DISPLAYS LIST OF EXPENSES
function renderExpenseItems2(expenseData) {
  console.log(expenseData);
  const expenseItemsHTML = generateExpensesHTML(expenseData);
  // console.log(expenseData);
  $('.expenses').append('');
  $('#budgetPageSection').append(expenseItemsHTML);
}

// MAPS THROUGH DATA AND GENERATES LIST OF EXPENSE ITEMS
function generateExpensesHTML(expenseData){
  const expenseItems = expenseData.expenses;
  console.log(expenseItems);
  const expenseItemsHTML = Object.values(expenseItems).map(expense => {
    return generateExpenseItems(expense);
  }).join('');

  return `<section class='expenses'>
    <h3>Expenses</h3>
    <input class="addExpenseButton" type="button" value="+" role="button">Add Expense</input>
    <ul>
      ${expenseItemsHTML}
    </ul>

  </section>`;
}

// DISPLAYS EXPENSE SECTION AND ADD EXPENSE BUTTON
function renderExpenseList(){
  $('main').append( `<section class='expenses'>
    <h3>Expenses</h3>
    <input class="addExpenseButton" id="addExpenseButton" type="button" value="+" role="button">Add Expense</input>
  </section>`);
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
function generateExpenseItems(expenseData) {
  return `<li class="subCatItem">
      <p>${expenseData.title}</p>
      ${generateSlider(expenseData.title)}
      <p id='${expenseData.title}-value'>\$${calculateExpenseAmt(expenseData.percentage)}</p>
    </li>`;
}

// GENERATES SLIDER
function generateSlider(name){
  let percentVal = expenseData.events.find(event => event.name === selectedEvent).expenseData[name].percentage;

  return `<div id=${name} class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="${percentVal*100}" class="slider" id="myRange">
      <label for="slider">percent of budget<label>
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
    e.preventDefault();
    generateAddEventForm();
  })
}

//HANDLES SUBMIT EXPENSE BUTTON
function handleExpenseSubmitButton(eventSelectedID){
  $('form').on('click', '#submitNewExpense', function(e){
    e.preventDefault(e);
    getNewExpenseInputVals(eventSelectedID);
    // fetchGETExpense(eventSelectedID);
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
  fetchGETExpense(eventSelectedID);
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

    console.log(postRequestData);
    callAPIPOST(postRequestData);
}

// CALL TO API TO GET ALL EVENTS
function fetchGET(){
  fetch('http://localhost:8080/events')
  .then(res => res.json())
  .then(newResponse => appendToDOM(newResponse))
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
renderExpenseItems2(newResponse)
    // generateEventItemHTML(newResponse)
  )
  .catch(error => console.log(error))
}

function fetchGETExpense(eventSelectedID){
  fetch(`http://localhost:8080/events/${eventSelectedID}`)
  .then(res => res.json())
  .then(expenseData => {
    generateExpensesHTML(expenseData)
  })
  .catch(error => console.log(error))
}


//
$(fetchGET());
$(listenEventSelected());
$(handleAddEventButton());
