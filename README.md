# budgetApp
A budget calculation app based on JavaScript. It takes input in the form of Income or Expense and calculates the budget and the percentage of each income.

The code is written in controler design pattern where there are two controllers namely BudgetController and UIController which works independently of each other and a seperate controller and works with the instances of the other two independant modules. 

Installation
------------

1. clone this repo on a local machine
2. Run `npm install`
3. Run `npm run dev`


Data Structure
--------------

A private data structure in the following format to store and retrieve the data
```
let data = {
      allitems : {
          inc : 
          exp : 
      },
      totals : {
          exp : ,
          inc : 
      },
      budget :     
      percentage :     
    };
    
```

