var budgetController = (function() {
    
    var Expense = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value    
            
    };
    
     var Income = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value    
            
    };
    
    var data = {
      allitems : {
          inc : [],
          exp : []
      },
      totals : {
          exp : 0,
          inc : 0
      }
    };
    
    return {
      additem :  function (type,desc,value)
        {
            var newItem,ID;
            
            if(data.allitems[type].length > 0){
                ID = data.allitems[type][data.allitems[type].length -1].id + 1;
            }else{
                ID = 0;
            }
            
            if(type === "exp"){
                newItem = new Expense(ID,desc,value);
            }else{
                newItem = new Income(ID,desc,value);
            }
            
            data.allitems[type].push(newItem);   
            return newItem;
        },
        
        testing : function(){
            console.log(data);
        }
    };
    
  
    
    })();


var UIController = (function ()
{
    var DOMStrings = {
      type : "type__select",
      desc : "description",
      value : "value",
      click : "add__value",
      incomeList : "income__list",
      expenseList : "expenses__list"    
        
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
         },
        addItemToUI : function(obj,type){
        var html,newhtml,root;
        
        if(type === "exp"){
            root =DOMStrings.expenseList;
            html = ' <div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else{
            root =DOMStrings.incomeList;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        newhtml = html.replace("%id%",obj.id);
        newhtml = newhtml.replace("%desc%",obj.desc);
        newhtml = newhtml.replace("%value%",obj.id);
        
        document.querySelector("."+root).insertAdjacentHTML("beforeend",newhtml);
        
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
          if( event.keyCode === 13 || event.which === 13){
                ctrlAddition();
            }
    });
        
    }
  
    var ctrlAddition = function () {
        var input,newItem;
        
        input = UICtrl.getInput();
        //console.log(input);
        
        newItem = budgetCtrl.additem(input.type,input.desc,input.value);
        
        //console.log(newItem);
        UICtrl.addItemToUI(newItem,input.type);
        
    };
    
    
    
    
  return{
      init : function(){
          setUpEventListeners();
      }
  }
   })(budgetController,UIController);

controller.init();