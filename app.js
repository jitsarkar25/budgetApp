//handles everything related to the calculation of budget
var budgetController = (function() {
    
    //function factory for expense
    var Expense = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value
        this.percentage = -1
            
    };
    
    //calculates the percentage of expense
    Expense.prototype.calPercentage = function(totalIncome){
      
        //checking if total income is greater than 0, otherwise we cant have expense percentage
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    };
    
    //returns the percentage of expense
    Expense.prototype.getPercentage =function(){
        return this.percentage;
    };
    
    //function factory for income
     var Income = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value    
            
    };
    
    //calculates the total income and expense
    var calculateTotal = function(type){
        var sum = 0;
        
        data.allitems[type].forEach(function(cur){
           sum += cur.value; 
        });
        
        data.totals[type] = sum;
        
    };
    
    //data structure containing all the incomes and expenses along with the totals
    var data = {
      allitems : {
          inc : [],
          exp : []
      },
      totals : {
          exp : 0,
          inc : 0
      },
      budget : 0,    
      percentage : -1    
    };
    
    //returning the object with the public functions
    return {
        //add new income or expense
      additem :  function (type,desc,value)
        {
            var newItem,ID;
            
            if(data.allitems[type].length > 0){
                //getting the id of the last item and adding 1 to get the new id
                ID = data.allitems[type][data.allitems[type].length -1].id + 1;
            }else{
                //if no item is present
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
        
        //remove income or expense
        deleteItem : function(type,id){
            
            for(var i = 0 ; i < data.allitems[type].length ; i++){
                if( data.allitems[type][i].id === id)
                    {
                        data.allitems[type].splice(i,1);
                        break;
                    }
            }
        },
        
        //calculates the total budget
        calculateBudget : function(){
            
            calculateTotal("exp");
            calculateTotal("inc");
            
            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.budget > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        
        //calculates the percentage of expense
        calculatePercentage : function(){
            
            data.allitems.exp.forEach(function(cur){
                cur.calPercentage(data.totals.inc);
            });
            
        },
        
        //returns the percentage of each expense in an array
        getPercentage : function(){
            
            var allper = data.allitems.exp.map(function(cur){
               return  cur.getPercentage();
                
            });
            
            return allper;
        },
        
        //returns the budget data from the private data structure 
        getBudget : function(){
          return {
            budget : data.budget,
            percentage : data.percentage,
            income : data.totals.inc,
            expense : data.totals.exp  
          };  
        },
/*
        testing : function(){
            console.log(data);
        }*/
    };
    
  
    
    })();

//handles everything related to changes in th UI
var UIController = (function ()
{
    //object containing the class and ids of the html tags to be modified
    var DOMStrings = {
      type : "type__select",
      desc : "description",
      value : "value",
      click : "add__value",
      incomeList : "income__list",
      expenseList : "expenses__list",    
      headBudget : "budget__value",
      headIncome: "budget__income--value",
      headExpense: "budget__expenses--value",
      headPercentage: "budget__expenses--percentage",
      container : "container",
      percentage : ".item__percentage",
      date : "budget__title--month"    
    };
    
    //returning public methods
    return {
        //returns the values aftre each input
      getInput : function (){
       return {
         type : document.getElementById(DOMStrings.type).value,
         desc : document.getElementById(DOMStrings.desc).value,    
         value : parseFloat(document.getElementById(DOMStrings.value).value )
       }
         
      },
        
        //displays the buget on the top of the screen
        displaybudget : function(obj){
            
            if(obj.budget > 0){
                
                document.getElementById(DOMStrings.headBudget).innerHTML = "+ "+obj.budget;
                document.getElementById(DOMStrings.headPercentage).innerHTML = obj.percentage + "%";
            }else{
                document.getElementById(DOMStrings.headBudget).innerHTML = obj.budget;
                document.getElementById(DOMStrings.headPercentage).innerHTML = "---";
            }
            
            document.getElementById(DOMStrings.headExpense).innerHTML = obj.expense;
            document.getElementById(DOMStrings.headIncome).innerHTML = obj.income;
            
        },
        
        //returns the DOMStrings
         getDOMStrings :  function (){
             return DOMStrings;
         },
        
        //deletes an Item from the UI
        deleteIemfromUI : function (selectorID){
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        }, 
        
        //updates the expense percentage when a new income/expense is added or deleted
        updatepercentage : function(percentage){
            var fields = document.querySelectorAll(DOMStrings.percentage);
            
            //creating a function to enale Foreach loop in lists
            var listsForeach = function(list,callback){
              
                for(var i = 0; i < list.length ; i++){
                    callback(list[i],i);
                }
            };
            
            //callback method for the foreach loop
            listsForeach(fields,function(current,index){
                if(percentage[index] > 0){
                    current.textContent = percentage[index] + "%";
                }else {
                    current.textContent = "---";
                }
            });
            
        },
        
        //displays the month and year at the top of the page
        displayDate : function(){
            
            var date = new Date();
            
            var month = date.getMonth();
            var year = date.getFullYear();
            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            document.getElementById(DOMStrings.date).innerHTML = months[month] + ' ' +year;
        },
        
        //adds an income or expense to the UI
        addItemToUI : function(obj,type){
        var html,newhtml,root;
        
        if(type === "exp"){
            root =DOMStrings.expenseList;
            html = ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else{
            root =DOMStrings.incomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        newhtml = html.replace("%id%",obj.id);
        newhtml = newhtml.replace("%desc%",obj.desc);
        newhtml = newhtml.replace("%value%",obj.value);
            
        
        document.querySelector("."+root).insertAdjacentHTML("beforeend",newhtml);
        document.getElementById(DOMStrings.desc).value="";
        document.getElementById(DOMStrings.value).value="";
            
        
    }
    
    };
    
     

    //some code here
})();


//has access to public methods of both UIController and budgetController
var controller = (function(budgetCtrl,UICtrl){
  
    //sets up all the event listners
    var setUpEventListeners = function()
    {
        //gets the DOMStrings from the UI controller
          var DOMStrings = UICtrl.getDOMStrings();
          var addValueBtn = document.getElementById(DOMStrings.click);
          addValueBtn.addEventListener("click",ctrlAddition);
        
        //13 is the keycode of the ENTER key
          document.addEventListener("keypress",function(event){
          if( event.keyCode === 13 || event.which === 13){
                ctrlAddition();
            }
          document.getElementById(DOMStrings.container).addEventListener("click",ctrlDeletion);      
    });
        
    }
    
    //updates the percentage of expense when a new income or expense is added 
    var updatePercentage = function(){
        
        //calculate the pecentage of expense
        budgetCtrl.calculatePercentage();
        
        //contains the percentage of each expenses
        var per = budgetCtrl.getPercentage();
       
        //displaying the percentage in the UI
        UICtrl.updatepercentage(per);
        
    }
    
    //update the budget when changes are made
    var updateBudget = function(){
        
        //calculate the budget
        budgetCtrl.calculateBudget();
        
        //get the budget
        var newBudget = budgetCtrl.getBudget();
        
        //display the budget to the UI
        UICtrl.displaybudget(newBudget);
    }
  
    //adds an income or expense
    var ctrlAddition = function () {
        var input,newItem;
        
        //get he input values
        input = UICtrl.getInput();
      
        //add the values to the budget data 
        if(input.desc !== "" && !isNaN(input.value) && input.value !==""){
        newItem = budgetCtrl.additem(input.type,input.desc,input.value);
        
        //all the item to the UI
        UICtrl.addItemToUI(newItem,input.type);
            
        //update the budget        
        updateBudget();    
            
        //update the percentage of expenses    
        updatePercentage();    
        }
        
    };
    
    
    //deletes an income or expense
    var ctrlDeletion = function(event){
        var itemID,type,id,newbudget;
        
        //get the itemID of the parent node 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
        //spliting the id gies us the type (exp or inc) and the index of of the item in the //array
        type=itemID.split("-")[0];
        id=parseFloat(itemID.split("-")[1]);
        
        //remove the data of the deleted item from the budget data
        budgetCtrl.deleteItem(type,id);
        
        //calculate the new budget
        budgetCtrl.calculateBudget();
        newBudget = budgetCtrl.getBudget();
        
        //Updates the main budget area on the top
        UICtrl.displaybudget(newBudget);
        
        //deletes the selected income/expense from th UI
        UICtrl.deleteIemfromUI(itemID);
        
        //update the percentage of the expenses with the new data
        updatePercentage();
        
    };
    
    
    
    
  return{
      //starts the application
      init : function(){
          
          setUpEventListeners();
          
          //displays the month and year at the top of the page from the beginning
          UICtrl.displayDate();
      }
  }
   })(budgetController,UIController);

controller.init();