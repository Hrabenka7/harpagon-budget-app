// ----------------- Budget Controller ----------------------------- //
var budgetController = (function()  {
   
  // constructor of type Expense
  var Expense = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value; 
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100)
    }
    else {
      this.percentage = -1
    }
  }; 

  Expense.prototype.getPercentage = function() {
    return this.percentage
  }

  // constructor of type Income
  var Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    console.log('type', type)
    data.allRecords[type].forEach(function(element) {
      sum = sum + element.value
    }) 
    data.totals[type] = sum
  };

  // incomes & expenses data structure
  var data = {
    allRecords: {
      exp: [],
      inc: [] 
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  }

  return {
    // add new Expense or Income
    addRecord: function(type, des, val) {
      var newRecord, ID;

      // assign ID to expense, income 
      if(data.allRecords[type].length > 0) {
        ID = data.allRecords[type][data.allRecords[type].length-1].id + 1
      }
      else {
        ID = 0
      }
      
      // determine exp or inc
      if(type === 'exp') {
        newRecord = new Expense(ID, des, val);
      }
      else if(type === 'inc') {
        newRecord = new Income(ID, des, val)
      }
      
      // push to the correct data array
      data.allRecords[type].push(newRecord);
      return newRecord;
    },


    deleteRecord: function(type, id) {
      var idsArray, index

      // map returns new array and return index of the 'to-delete' item
      idsArray = data.allRecords[type].map(function(current) {
        return current.id
      })
      index = idsArray.indexOf(id);

      if(index !== -1) {
        data.allRecords[type].splice(index, 1)
      }

    },

    calculateBudget : function() {
      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // calculate the budget: income - expenses
      data.budget = data.totals['inc'] - data.totals['exp']
      
      if(data.totals.inc > 0) {
        //data.budget = data.totals['inc'] - data.totals['exp']
        // calculate the prercentage of income that we spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      }
      else {
        //data.budget = data.totals['inc'] - data.totals['exp']
        data.percentage = -1
      }
    },

    calculatePercentages: function() {
      data.allRecords.exp.forEach(function(current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allRecords.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },


    getBudget: function () {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpense: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function () {
      console.log(data);
    }
  }

}) ();


//--------------------- UI Controller ---------------------------------------//
var UIController = (function () {
  
  // set Dom elements names
  var DOMstrings = {
    type: '.add__type',
    description: '.add__description',
    value: '.add__value',
    button: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'

  };
  
  
  return {
    // get value from input fields
    getInput: function () {
      return {
        type : document.querySelector(DOMstrings.type).value,
        description : document.querySelector(DOMstrings.description).value,
        value : parseFloat(document.querySelector(DOMstrings.value).value)
      };
    },

    // get DOM elements names
    getDOMstrings: function () {
      return DOMstrings;
    },

   // add new record into the list
    addListRecord: function (obj, type) {
      var html, newHtml, element;

      if(type === 'inc') 
      {
        element = DOMstrings.incomeContainer

        html = ` <div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
      }
      else if(type === 'exp') 
      {
        element = DOMstrings.expenseContainer

        html = `<div class="item clearfix" id="exp-%id%">
          <div class="item__description">%description%</div>
          <div class="right clearfix">
            <div class="item__value">%value%</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
        </div>`
      }      

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.desc);
      newHtml = newHtml.replace('%value%', obj.value)
    
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListRecord: function(selectorId) {
      var element = document.getElementById(selectorId)
      // element can be only removed as a child element of a parent
      element.parentNode.removeChild(element)
    },

    clearFields: function() {
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMstrings.description + ',' + DOMstrings.value);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";
      });

      // sets focus on the first element on the array
      fieldsArray[0].focus()
    },

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExpense
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage
      
      if(obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '-'
      }
    },

    displayPercentages: function(percentages) {

    var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

       var nodeListForEach = function(list, callback) {
         for( var i = 0; i < list.length; i++) {
           callback(list[i], i);
         }
       }

       nodeListForEach(fields, function(current,index) {
         if( percentages[index] > 0) {
           current.textContent = percentages[index] + '%';
         }
         else {
           current.textContent = '---'
         }
       }) 
    },

  };
  
}) ();


//------------------------Global Controller-------------------------------------------//
var appController = (function(budgetCtrl, UICtrl) {
  
  var setEventListeners = function () {
    
    // get DOM elements names
    var DOM = UICtrl.getDOMstrings()
    
    // event listeners for button ADD (tick)
    document.querySelector(DOM.button).addEventListener('click', addRecord); 
    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13) {  // enter key pressed
        addRecord();
      } 
    });
    
    // event listerners for buttod DELETE (cross)
    document.querySelector(DOM.container).addEventListener('click', deleteRecord);
  }

  var updateBudget = function() {

    // Calculate budget
      budgetController.calculateBudget();
    
    // Returns the budget
    var budget = budgetController.getBudget();

    // Display the budget on the UI
    UIController.displayBudget(budget)
  }

  var updatePercentages = function() {
    // Calculate percentages
    budgetController.calculatePercentages();

    // Read percentages from the budget controller
    var percentages = budgetController.getPercentages();

    // Update the UI with the new percentages
    //console.log('percentages', percentages);
    UIController.displayPercentages(percentages);

  }
  
  var addRecord = function() {
    var input;
    var record;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add record to the budgetController
      record = budgetCtrl.addRecord(input.type, input.description, input.value)
    
      // 3. Add record to the UI
      UIController.addListRecord(record, input.type);
  
      // 4. Clear Fields
      UIController.clearFields();
  
      // 5. Calculate and update Budget
      updateBudget()

      // 6. Calculate and update percentages
      updatePercentages()
    } 
  }

  var deleteRecord = function (event) {
    var recordId;
    recordId = event.target.parentNode.parentNode.parentNode.parentNode.id; // event target = where we clicked, up to the id of the element we are interested to delete

    // as there are no other Ids within the doc
    if(recordId) {
      splitId = recordId.split('-')
      type = splitId[0]
      id = parseInt(splitId[1])

      // 1. delete item from the data structure
      budgetController.deleteRecord(type,id);

      // 2. delete item from the interface
      UIController.deleteListRecord(recordId);

      // 3. update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  }
  
  return {
    // set eventlisteners on app start
    init: function () {
      console.log("App started");
      UIController.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1
      });
      setEventListeners();
    }
  }
  
}) (budgetController, UIController)


appController.init();