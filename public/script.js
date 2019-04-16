const data = {
  events: [
    {
      name: 'Marathon Weekend',
      date:123,
      budget: 1000
    },
    {
      name: 'Surprise Party',
      date:123,
      budget: 1000
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
}

// events page

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
        <ul>
        ${eventItems}
        </ul>
      </section>`;
}

function generateEventItemHTML(event) {
  return `<li>
      <p>${event.name}</p>
      <p>${event.date}</p>
      <p>${event.budget}</p>
    </li>`;
}

// SCREEN TWO ----
// part I -- total budget section
function generateTotalBudgetHTML(){
  return `<section class="totBud">
    <h3>Total Budget</h3>

    <label for="totalBudget">Event Total Budget:</label>

    <input type="number" id="totBudget" name="totalBudget"
          min="10">

  </section>`;

};


function generateExpensesHTML(){
  console.log('hello');
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
  $('main').append(generateTotalBudgetHTML);
  renderExpenseItems2();
  handleSliderChange();
}

function renderExpenseItems2() {
  const expenseItemsHTML = generateExpensesHTML();
  $('main').append(expenseItemsHTML);
}

function generateExpenseItems(expense) {
  //would I also have to pass the calculateExpenseAmt fx here?
  return `<li class="subCatItem">
      <p>${expense.name}</p>
      ${generateSlider(expense.name)}
      <p id='${expense.name}-value'>${calculateExpenseAmt(expense.value)}</p>
    </li>`;
  // return generateSlider();
}

function calculateExpenseAmt(value){
  let expenseBudget = 1000;
  console.log(expenseBudget);

  let expenseTypeAmt = expenseBudget*(value/100);
  console.log(expenseTypeAmt);

  return expenseTypeAmt;
}

// not sure if this should stand on its own?
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




// budget page
// function generateBudgetPage(){
//   const eventTitle = data.events.map.name(event => {
//     console.log(eventTitle);
//   }).join('');
//   return `
//     <section class="eventBudget">
//     <h3>${eventTitle}</h3>
//     <
//   `
// }


//
$(renderEvents());
$(renderExpenseItems());
