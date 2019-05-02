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
// SCREEN ONE - list of events

function renderEvents() {
  const eventsHTML = generateEventsHTML();
  $('main').html(eventsHTML);
}

function generateEventsHTML() {
  const eventItems = data.events.map(event => {
    return generateEventItemHTML(event);
  }).join('');

  return `<section class='events'>
        <h3>Events</h3>
        <input class="addEventButton" type="button" value="+" role="button">Add Event</input>
        <ul class="eventItemsList">
        ${eventItems}
        </ul>
      </section>`;
}

function generateEventItemHTML(newResponse) {
  console.log('this is the data', newResponse);
  return `<li class="eventItem" id="${event.name}">
      <p>${event.name}</p>
      <p>${event.date}</p>
      <p>Budget: $${event.budget}</p>
    </li>`;
}

//CHANGE SCREENS

function listenEventSelected(){
  $('.eventItemsList').on('click', 'li', function(e){
    let eventSelected = $(this).attr('id');

    selectedEvent = eventSelected;
    replaceHTML(selectedEvent);
  });
}

function replaceHTML(selectedEvent){
  let budgetPageHTML = generateTotalBudgetHTML(selectedEvent);
  $('main').html(`
    <section id="budgetPageSection"></section>`);
  $('#budgetPageSection').append(budgetPageHTML);
  renderExpenseItems();
}

function generateTotalBudgetHTML(selectedEvent){
  return `
    <section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Visualize your budget for your upcoming ${selectedEvent}</h3>
        <label for="totalBudget">What's your budget?:</label>
        <input type="number" id="totBudget" name="totalBudget"
              min="10">
    </section>`;

};

function renderExpenseItems() {
  renderExpenseItems2();
  handleSliderChange();
  handleTotBudChange()
}

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
    // a function which only re-renders the values under the slider
    $(`#${name}-value`).text(calculateExpenseAmt(val/100));
  })
}

function calculateExpenseAmt(percentage){
  let expenseBudget = data.events.find(event => event.name === selectedEvent).budget;
  let expenseTypeAmt = expenseBudget*percentage;
  return Math.floor(expenseTypeAmt);
}

function renderExpenseItems2() {
  const expenseItemsHTML = generateExpensesHTML();
  $('.expenses').html('');
  $('#budgetPageSection').append(expenseItemsHTML);
}


function generateExpensesHTML(){
  const expenseItems = data.events.find(event => event.name === selectedEvent).expenses;

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

function generateExpenseItems(expense) {
  return `<li class="subCatItem">
      <p>${expense.name}</p>
      ${generateSlider(expense.name)}
      <p id='${expense.name}-value'>\$${calculateExpenseAmt(expense.percentage)}</p>
    </li>`;
}

function generateSlider(name){
  let percentVal = data.events.find(event => event.name === selectedEvent).expenses[name].percentage;

  return `<div id=${name} class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="${percentVal*100}" class="slider" id="myRange">
      <label for="slider">percent of budget<label>
    </div>`;
}

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

// + BUTTONS - POST REQUESTS (EVENTS)

function handleAddEventButton(){
  //displays form or input fields

  $('body').on('click', 'input[type="button"]', function(e){
    generateAddEventForm();
  })
}

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

function onNewEventSubmit(){
  $('form').on('click', 'input[type="submit"]', function(e){
    event.preventDefault(e);
    getNewEventInputVals();
  });
}

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
    callAPI(postRequestData);
}


// CALL TO API

function callAPI(postRequestData){
  fetch('http://localhost:8080/events', {
      method: 'POST',
      body: JSON.stringify(postRequestData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(response => response.json())
  .then(newResponse => generateEventItemHTML(newResponse))
  .catch(error => console.log(error))
}


$(renderEvents());
$(listenEventSelected());
$(handleAddEventButton());
