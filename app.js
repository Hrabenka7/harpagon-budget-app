var budgetController = (function()  {}) ();


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
    // 1. Get the field input data
    var input = UICtrl.getInput()
    console.log(input);
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