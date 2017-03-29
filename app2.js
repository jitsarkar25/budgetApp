

class Expense{
    
    constructor(id,desc,value){
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    }

    
    calPercentage (totalIncome) {
      
        //checking if total income is greater than 0, otherwise we cant have expense percentage
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
        
    };
    
    getPercentage (){
        return this.percentage;
    }
}

class Income{
    
    constructor(id,desc,value) {
        this.id = id,
        this.desc = desc,
        this.value = value            
    }
    
}

class BudgetController{
    
    constructor(){
    
      let data = {
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
    
        let calculateTotal = function(type){
        let sum = 0;
        
        data.allitems[type].forEach(cur => sum+=cur.value);
         
        data.totals[type] = sum;
        
    };
    
        
        this.additem =function(type,desc,value)
        {
            let newItem,ID;
            
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
        };
        
        this.getData = function(){
            return data.allitems.exp;
        };
        
        this.deleteItem = function(type,id){
            
            for(let i = 0 ; i < data.allitems[type].length ; i++){
                if( data.allitems[type][i].id === id)
                    {
                        data.allitems[type].splice(i,1);
                        break;
                    }
            }
        }
        
        this.calculatePercentage = function(){
            
            data.allitems.exp.forEach((cur) => cur.calPercentage(data.totals.inc));
            
        };
        
        this.calculateBudget = function(){
            
            calculateTotal("exp");
            calculateTotal("inc");
            
            data.budget = data.totals.inc - data.totals.exp;
            
            if(data.budget > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        }
        
        this.getPercentage = function(){
            
            var allper = data.allitems.exp.map((cur) =>  cur.getPercentage());
            
            return allper;
        }
        
        this.getBudget = function(){
          return {
            budget : data.budget,
            percentage : data.percentage,
            income : data.totals.inc,
            expense : data.totals.exp  
          };  
        }
    }
    
   
}

/*let bc = new BudgetController();
bc.additem("exp","car",500);
bc.additem("exp","car",100);
bc.additem("inc","car",1000);
bc.calculateBudget();
bc.calculatePercentage();
console.log(bc.getData());
let perc = bc.getPercentage();
let budget = bc.getBudget();
console.log(perc);
console.log(budget);*/

class UIController{
    
    constructor(){
        
      let DOMStrings = {
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
    
    this.getInput = function (){
       // console.log("here");
       return {
         type : document.getElementById(DOMStrings.type).value,
         desc : document.getElementById(DOMStrings.desc).value,    
         value : parseFloat(document.getElementById(DOMStrings.value).value )
       }
    };
        
    this.addItemToUI = function(obj,type){
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
            
    };
        
    this.displaybudget = function(obj){
            
            if(obj.budget > 0){
                
                document.getElementById(DOMStrings.headBudget).innerHTML = "+ "+obj.budget;
                document.getElementById(DOMStrings.headPercentage).innerHTML = obj.percentage + "%";
            }else{
                document.getElementById(DOMStrings.headBudget).innerHTML = obj.budget;
                document.getElementById(DOMStrings.headPercentage).innerHTML = "---";
            }
            
            document.getElementById(DOMStrings.headExpense).innerHTML = obj.expense;
            document.getElementById(DOMStrings.headIncome).innerHTML = obj.income;
            
        };

        
    this.updatepercentage = function(percentage){
            let fields = document.querySelectorAll(DOMStrings.percentage);
            
            //creating a function to enale Foreach loop in lists
            let listsForeach = function(list,callback){
              
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
            
        }
    
    this.deleteIemfromUI = function (selectorID){
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        };
        
    this.getDOMStrings = function (){
             return DOMStrings;
         }    
}
    
  static displayDate(){
            let  date = new Date();
            
            let month = date.getMonth();
            let year = date.getFullYear();
            let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            document.getElementById("budget__title--month").innerHTML = months[month] + ' ' +year
  }  

}

class Controller {
    
    constructor(budgetCtrl,UICtrl){
        
        this.budgetCtrl = budgetCtrl;
        this.UICtrl = UICtrl;

        //setting up the event listeners
        let setupeventlisteners = function(){
            let DOMStrings = UICtrl.getDOMStrings();
            let click = document.getElementById(DOMStrings.click);
            click.addEventListener("click",() => ctrlAddition());
            
            document.addEventListener("keypress",event => {
                if( event.keyCode === 13 || event.which === 13){
                    ctrlAddition();
                }
        });  
            
        document.getElementById(DOMStrings.container).addEventListener("click",() => ctrlDeletion(event)); 
    }();
        
        var ctrlAddition = function () {
        let input,newItem;
        
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
        
    var updateBudget = function() {
        
        //calculate the budget
        budgetCtrl.calculateBudget();
        
        //get the budget
        let newBudget = budgetCtrl.getBudget();
        
        //display the budget to the UI
        UICtrl.displaybudget(newBudget);
    }; 
        
    var updatePercentage = function() {
        
        //calculate the pecentage of expense
        budgetCtrl.calculatePercentage();
        
        //contains the percentage of each expenses
        var per = budgetCtrl.getPercentage();
       
        //displaying the percentage in the UI
        UICtrl.updatepercentage(per);
        
    } 
    
    var ctrlDeletion = function(event){
        let itemID,type,id,newBudget;
        
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
            
        
}
    

}
(function(){
    
    new Controller(new BudgetController,new UIController);
    UIController.displayDate();
   // console.log("started");
}());