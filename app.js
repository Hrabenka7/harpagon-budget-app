var budgetController = (function()  {

}) ();


var UIController = (function () {

  var DOMstrings = {
    type: '.add__type',
    description: '.add__description',
    value: '.add__value',
    button: '.add__btn'
  };
  

  return {
    getInput: function () {
      return {
        type : document.querySelector(DOMstrings.type).value,
        decription : document.querySelector(DOMstrings.description).value,
        value : document.querySelector(DOMstrings.value).value
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    }
  };
  
}) ();


// Global Controller
var appController = (function(budgetCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings()
  
  var addItem = function() {
  // 1. Get the field input data
    var input = UICtrl.getInput()
    console.log(input);
  }

  document.querySelector(DOM.button).addEventListener('click', addItem);
  

  document.addEventListener('keypress', function(event){
    console.log('event', event)

    if(event.keyCode === 13 || event.which === 13) {  // enter key pressed
      addItem();
    } 
  });

}) (budgetController, UIController)
