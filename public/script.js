const data = {
  events: [
    {
      name: 'Marathon Weekend',
      date:'September 14, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'foood',
          percentage: .5
        },
        'transportation': {
          name: 'transportation',
          percentage: .5
        },
        'accomodation':{
          name: 'accomodation',
          percentage: .5
        }
      }
    },
    {
      name: 'Surprise Party',
      date:'May 28, 2019',
      budget: 1000,
      expenses: {
        'food': {
          name: 'foood',
          percentage: .5
        },
        'transportation': {
          name: 'transportation',
          percentage: .5
        },
        'accomodation':{
          name: 'accomodation',
          percentage: .5
        }
      }
    },
    {
      name: 'Bachelorette Weekend',
      date: 'August 23, 2019',
      budget: 500,
      expenses: {
        'food': {
          name: 'foood',
          percentage: .5
        },
        'transportation': {
          name: 'transportation',
          percentage: .5
        },
        'accomodation':{
          name: 'accomodation',
          percentage: .5
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
        <ul class="eventItemsList">
        ${eventItems}
        </ul>
      </section>`;
}

function generateEventItemHTML(event) {
  return `<li class="eventItem" id="${event.name}">
      <p>${event.name}</p>
      <p>${event.date}</p>
      <p>${event.budget}</p>
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
      <h3>Total Budget</h3>
        <label for="totalBudget">Event Total Budget:</label>
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
  $('input[type="range"]').on('change', function(e) {
    const name = $(this).closest('div').attr('id');
    const val = $(this).val();
    console.log(JSON.stringify(data.events));

    data.events.find(event => event.name === selectedEvent).expenses[name].percentage = val/100;

    console.log(JSON.stringify(data.events));

    // a function which only re-renders the values under the slider
    $(`#${name}-value`).text(calculateExpenseAmt(val/100));
  })
}

function calculateExpenseAmt(percentage){
  let expenseBudget = data.events.find(event => event.name === selectedEvent).budget;
  console.log(expenseBudget);

  let expenseTypeAmt = expenseBudget*percentage;
  return Math.floor(expenseTypeAmt);
}

function renderExpenseItems2() {
  const expenseItemsHTML = generateExpensesHTML();
  $('#budgetPageSection').append(expenseItemsHTML);
}


function generateExpensesHTML(){
//modify to consider specific event and loop over those expenses
  const expenseItems = data.events.find(event => event.name === selectedEvent).expenses;

  const expenseItemsHTML = Object.values(expenseItems).map(expense => {
    return generateExpenseItems(expense);
  }).join('');

  console.log(expenseItemsHTML)

  return `<section class='expenses'>
    <h3>Expenses</h3>
    <ul>
      ${expenseItems}
    </ul>
  </section>`;
}

function generateExpenseItems(expense) {
  return `<li class="subCatItem">
      <p>${expense.name}</p>
      ${generateSlider(expense.name)}
      <p id='${expense.name}-value'>${calculateExpenseAmt(expense.percentage)}</p>
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
    console.log(triggered);

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

$(renderEvents());
$(listenEventSelected());
