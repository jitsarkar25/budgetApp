var budgetController = (function() {
    
    var Expense = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value
        this.percentage = -1
            
    };
    
    Expense.prototype.calPercentage = function(totalIncome){
      
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage =function(){
        return this.percentage;
    };
    
     var Income = function(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value    
            
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        
        data.allitems[type].forEach(function(cur){
           sum += cur.value; 
        });
        
        data.totals[type] = sum;
        
    };
    
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
        
        deleteItem : function(type,id){
            
            for(var i = 0 ; i < data.allitems[type].length ; i++){
                if( data.allitems[type][i].id === id)
                    {
                        data.allitems[type].splice(i,1);
                        break;
                    }
            }
        },
        
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
        
        calculatePercentage : function(){
            
            data.allitems.exp.forEach(function(cur){
                cur.calPercentage(data.totals.inc);
            });
            
        },
        
        getPercentage : function(){
            
            var allper = data.allitems.exp.map(function(cur){
               return  cur.getPercentage();
                
            });
            
            return allper;
        },
        
        getBudget : function(){
          return {
            budget : data.budget,
            percentage : data.percentage,
            income : data.totals.inc,
            expense : data.totals.exp  
          };  
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
      expenseList : "expenses__list",    
      headBudget : "budget__value",
      headIncome: "budget__income--value",
      headExpense: "budget__expenses--value",
      headPercentage: "budget__expenses--percentage",
      container : "container",
      percentage : ".item__percentage",
      date : "budget__title--month"    
    };
    return {
      getInput : function (){
       return {
         type : document.getElementById(DOMStrings.type).value,
         desc : document.getElementById(DOMStrings.desc).value,    
         value : parseFloat(document.getElementById(DOMStrings.value).value )
       }
         
      },
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
         getDOMStrings :  function (){
             return DOMStrings;
         },
        
        deleteIemfromUI : function (selectorID){
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        }, 
        
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
        
        displayDate : function(){
            
            var date = new Date();
            
            var month = date.getMonth();
            var year = date.getFullYear();
            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            document.getElementById(DOMStrings.date).innerHTML = months[month] + ' ' +year;
        },
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
          document.getElementById(DOMStrings.container).addEventListener("click",ctrlDeletion);      
    });
        
    }
    
    var updatePercentage = function(){
        
        budgetCtrl.calculatePercentage();
        
        //contains the percentage of each expenses
        var per = budgetCtrl.getPercentage();
       
        //displaying the percentage in the UI
        UICtrl.updatepercentage(per);
        
    }
    
    var updateBudget = function(){        
        budgetCtrl.calculateBudget();
        
        var newBudget = budgetCtrl.getBudget();
        console.log(newBudget);
        UICtrl.displaybudget(newBudget);
    }
  
    var ctrlAddition = function () {
        var input,newItem;
        
        
        input = UICtrl.getInput();
        //console.log(input);
        if(input.desc !== "" && !isNaN(input.value) && input.value !==""){
        newItem = budgetCtrl.additem(input.type,input.desc,input.value);
        
        //console.log(newItem);
        UICtrl.addItemToUI(newItem,input.type);
            
        updateBudget();    
            
        updatePercentage();    
        }
        
    };
    
    var ctrlDeletion = function(event){
        var itemID,type,id,newbudget;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        type=itemID.split("-")[0];
        id=parseFloat(itemID.split("-")[1]);
        
        budgetCtrl.deleteItem(type,id);
        
        budgetCtrl.calculateBudget();
        newBudget = budgetCtrl.getBudget();
        console.log(newBudget);
        
        //Updates the main budget area on the top
        UICtrl.displaybudget(newBudget);
        
        //deletes the selected income/expense from th UI
        UICtrl.deleteIemfromUI(itemID);
        
        updatePercentage();
        
    };
    
    
    
    
  return{
      init : function(){
          
          setUpEventListeners();
          UICtrl.displayDate();
      }
  }
   })(budgetController,UIController);

controller.init();