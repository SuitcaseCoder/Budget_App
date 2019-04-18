const data = {
  events: [
    {
      name: 'Marathon Weekend',
      date:'September 14, 2019',
      budget: 1000
    },
    {
      name: 'Surprise Party',
      date:'May 28, 2019',
      budget: 1000
    },
    {
      name: 'Bachelorette Weekend',
      date: 'August 23, 2019',
      budget: 500
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
  expenses: [
    {
      name: 'food',
      value: 50
    },
    {
      name: 'transportation',
      value: 50
    },
    {
      name: 'accomodation',
      value: 50
    }
  ]
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

// SCREEN TWO - TOP - total budget
function generateTotalBudgetHTML(selectedEvent){
  return `<section class="totBud">
      <h2>${selectedEvent}</h2>
      <h3>Total Budget</h3>

        <label for="totalBudget">Event Total Budget:</label>

        <input type="number" id="totBudget" name="totalBudget"
              min="10">

    </section>`;

};

// SCREEN TWO - BOTTOM - expenses

function generateExpensesHTML(){
  const expenseItems = data.expenses.map(expense =>{
    return generateExpenseItems(expense);
  }).join('');

  return `<section class='expenses'>
    <h3>Expenses</h3>
    <ul>
      ${expenseItems}
    </ul>
  </section>`;
}

function renderExpenseItems() {
  renderExpenseItems2();
  handleSliderChange();
  handleTotBudChange()
}

function renderExpenseItems2() {
  const expenseItemsHTML = generateExpensesHTML();
  $('main').append(expenseItemsHTML);
}

function generateExpenseItems(expense) {
  return `<li class="subCatItem">
      <p>${expense.name}</p>
      ${generateSlider(expense.name)}
      <p id='${expense.name}-value'>${calculateExpenseAmt(expense.value)}</p>
    </li>`;
}

function calculateExpenseAmt(value){
  let expenseBudget = 1000;
  console.log(expenseBudget);

  let expenseTypeAmt = expenseBudget*(value/100);
  console.log(expenseTypeAmt);

  return expenseTypeAmt;
}

function generateSlider(name){
  return `<div id=${name} class="slidecontainer">
      <input type="range" name="slider" min="0" max="100" value="50" class="slider" id="myRange">
      <label for="slider">percent of budget<label>
    </div>`;

}

function handleSliderChange(){
  $('input[type="range"]').on('change', function(e) {
    const name = $(this).closest('div').attr('id');
    const val = $(this).val();
    console.log(name, val);
    data.expenses = data.expenses.map(el => {
      if (el.name === name) {
        el.value = val;
      }
      return el;
    });
    // a function which only re-renders the values under the slider
    $(`#${name}-value`).text(calculateExpenseAmt(val));
  })
}

// IN BETWEEN SCREENS - hide first screen

function listenEventSelected(){
  $('.eventItemsList').on('click', 'li', function(e){
    let eventSelected = $(this).attr('id');

    selectedEvent = eventSelected;
    replaceHTML(selectedEvent);
  });
}

function replaceHTML(selectedEvent){
  let budgetPageHTML = generateTotalBudgetHTML(selectedEvent);
  $('main').html(budgetPageHTML);
  renderExpenseItems();
}

function handleTotBudChange(){
  $('input[type="number"]').on('change', function(e){
    console.log(selectedEvent);

    const val = $(this).val();
    console.log(val);

    data.events = data.events.map(el => {
      if (el.name == selectedEvent){
        el.budget = val;
        console.log(el.budget);
      }
      console.log(el);
      return el;
    });
    // calculateExpenseAmt ???
  })
}





// function hideEventsPage(){
//   $('.eventItemsList').on('click', 'li', function(e){
//     alert(this.id);
//     let eventSelected = this.id;
//     console.log(eventSelected);
//     $('.events').hide();
//     generateTotalBudgetHTML();
//   });
// }

// SHOW SLIDER RANGE NUMBER

// function displayCurrentRangeNum(){
// }

// UPDATES EXPENSE BUDGET PER EVENT





$(renderEvents());
$(listenEventSelected());
// $(renderExpenseItems());
// $(hideEventsPage());
