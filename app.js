// ----------------- Budget Controller ----------------------------- //
var budgetController = (function()  {
   
  // constructor of type Expense
  var Expense = function(id,desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value; 
  }

  // constructor of type Income
  var Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  // incomes & expenses data structure
  var data = {
    allRecords: {
      exp: [],
      inc: [] 
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    // add new Expense or Income
    addRecord: function(type,des,val) {
      var newRecord, ID;

      // assign ID
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
    button: '.add__btn'
  };
  
  
  return {
    // get value from input fields
    getInput: function () {
      return {
        type : document.querySelector(DOMstrings.type).value,
        decription : document.querySelector(DOMstrings.description).value,
        value : document.querySelector(DOMstrings.value).value
      };
    },

    // get DOM elements names
    getDOMstrings: function () {
      return DOMstrings;
    }
  };
  
}) ();


//------------------------Global Controller-------------------------------------------//
var appController = (function(budgetCtrl, UICtrl) {
  
  var setEventListeners = function () {
    
    // get DOM elements names
    var DOM = UICtrl.getDOMstrings()
    
    // event listeners for button ADD (tick)
    document.querySelector(DOM.button).addEventListener('click', addItem); 
    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13) {  // enter key pressed
        addItem();
      } 
    });
    
  }
  
  var addItem = function() {
    var input;
    var record;

    // 1. Get the field input data
    input = UICtrl.getInput();
    
    // 2. Add record to the budgetController
    record = budgetCtrl.addRecord(input.type, input.decription, input.value)
  }
  
  return {
    // set eventlisteners on app start
    init: function () {
      console.log("App started")
      setEventListeners();
    }
  }
  
}) (budgetController, UIController)


appController.init();