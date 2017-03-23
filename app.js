var budgetController = (function()
                       {
    

    
})();


var UIController = (function ()
{
    var DOMStrings = {
      type : "type__select",
      desc : "description",
      value : "value",
      click : "add__value",
        
        
    };
    return {
      getInput : function (){
       return {
         type : document.getElementById(DOMStrings.type).value,
         desc : document.getElementById(DOMStrings.desc).value,    
         value : document.getElementById(DOMStrings.value).value  
       }
         
      },
         
         getDOMStrings :  function (){
             return DOMStrings;
         }
    
    };
    //some code here
})();

var controller = (function(budgetCtrl,UICtrl){
  
    var setUpEventListeners = function()
    {
          var DOMStrings = UICtrl.getDOMStrings();
          var addValueBtn = document.getElementById(DOMStrings.click);
          addValueBtn.addEventListener("click",ctrlAddition);
    
           document.addEventListener("keypress",function(event){
       
        if( event.keyCode === 13 || event.which === 13)
            {
                ctrlAddition();
            }
    });
        
    }
  
    var ctrlAddition = function () {
        
        var input = UICtrl.getInput();
        console.log(input);
        
    };
    
  return{
      init : function(){
          setUpEventListeners();
      }
  }
   })(budgetController,UIController);

controller.init();