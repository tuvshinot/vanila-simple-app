//=====================================================================================================
var BudgetController = (function() {

    var Expense = function(id,description,value){
        this.id = id ,
        this.description = description,
        this.value = value
        this.percentage= -1;
    }

    
    Expense.prototype.calcPersentage = function(totalIncome) {
        
        if(totalIncome > 0 ) {
            this.percentage = Math.round((this.value / totalIncome) * 100);            
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPersentage = function() {
        return this.percentage;
    }

    var Income = function(id,description,value){
        this.id = id ,
        this.description = description,
        this.value = value
    }

    var calculateTotal = function(type) {
        var sum = 0 ;

        data.allItems[type].forEach(function(element,index,arr){
            sum += element.value;
        });

        data.total[type] = sum;
    }

    var data = {
        allItems:{
            inc:[],
            exp:[]
        },
        total:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1 // does not exist
    }

    return {

        addItem:function(type,des,val) {
            var newItem, ID;           

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item based on type inc or exp
            if (type === "exp") {
                newItem = new Expense(ID,des,val);
            } else if(type === "inc") {
                newItem = new Income(ID,des,val);
            }

            // push it to data structure 
            data.allItems[type].push(newItem);
        
            // return new item
            return newItem;
        },
    
        calculateBudget:function() {
          // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
         // calculate budget income - expenses
            data.budget = data.total.inc - data.total.exp; 

         // calculate the persentage
            if(data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1 ;
            }
        },

        calculatePersentage:function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPersentage(data.total.inc);
            });
        },  

        getPersentage:function() {
            var allPersentages = data.allItems.exp.map(function(current){
                return current.getPersentage();
            });
            return allPersentages;
        },

        getBudget:function() {
            return {
                budget:data.budget,
                totalIncome:data.total.inc,
                totalExpenses:data.total.exp,
                persentage:data.percentage
            }
        },

        //===============Map and splice method=============================
        deleteItem:function(type, id) {
            
            //below returns new array of its element ids !!!!
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            // grab index
            index = ids.indexOf(id);

            // delete start index and delete one
            if(index !== -1) {
                data.allItems[type].splice(index,1);
            }

        }
    }

})();


//========================================================================================================
var UIController = (function() {
    var DOMstrings = {
        inputType:'.add-type',
        inputDescription:'.add-description',
        inputValue:'.add-value',
        inputBtn:'.add-btn',
        incomeList:'.income-list',
        expensesList:'.expenses-list',
        budgetValue:'.budget-value',
        budgetInc:'.budget-income-value',
        budgetExp:'.budget-expenses-value',
        persentage:'.budget-expenses-percentage',
        month:'.budget-title-month',
        container:'.container',
        expensesPersentage:'.item-percentage'
    }

    var nodeListForEach = function(list, callback) {
        for (let index = 0; index < list.length; index++) {
            callback(list[index], index); // see index = index below , current below is list[index]!!!
        }
    }

    var formatNumber = function(num) {
        num = Math.abs(num);
        num = num.toFixed(2); // to number.00 around to 2 decimal
        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, int.length);
        }
        
        return (int + '.' + numSplit[1]);

    }

    var getCurrentMonth = function() {
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aus","Sep","Oct","Nov","Dec"];
        var current = new Date();
        return months[current.getMonth()] + ' ' + current.getUTCFullYear();
    }

    return {

        displayMonth:function() {
            document.querySelector(DOMstrings.month).textContent = getCurrentMonth();       
        },  

        getInput:function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc exp
                desc: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // to make calculation!!!
            }       
        },

        //+++++++++++++++++++++++++++Important!!!++++++++++++++++++++++++++++++
        clearFields:function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); // making list to array!!!!

            // ++++++++++++++++ForEach other elements+++++++++
            fieldsArr.forEach(function(current, index, actualArr) {
                current.value = "";
            });

            fieldsArr[0].focus();
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        },

        addListItem:function(obj,type) {
        var html, newHtml, element;

            // create html string with placeholder        
        if(type === 'inc') {
            element = DOMstrings.incomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item-description">%desc%</div><div class="right clearfix"><div class="item-value">+ %value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';          
        } else if(type==='exp'){
            element = DOMstrings.expensesList;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%desc%</div><div class="right clearfix"><div class="item-value">- %value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';            
        }
        
            //Replace placeholder text with some actual data 
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%desc%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value));
            
            //insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem:function(selectorID) {
            // remove child elements

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        displayBudget:function(obj) {         
           
            document.querySelector(DOMstrings.budgetValue).textContent = '+' + formatNumber(obj.budget);                
            document.querySelector(DOMstrings.budgetInc).textContent = '+' + formatNumber(obj.totalIncome);
            document.querySelector(DOMstrings.budgetExp).textContent = '-' +  formatNumber(obj.totalExpenses);
          
            if(obj.persentage > 0) {
                document.querySelector(DOMstrings.persentage).textContent =  obj.persentage + '%';            

            } else {
                document.querySelector(DOMstrings.persentage).textContent = '---';                        
            }
        },

        displayPersentage:function(arrPersentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPersentage); // returns node list

            nodeListForEach(fields, function(current, index){

                if(arrPersentages[index] > 0) {
                    current.textContent = arrPersentages[index] + '%';                
                } else {
                    current.textContent = '---';                                    
                }
            });
        },

        changedType: function() { // using comma you can select couple of things
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector('.fa').classList.toggle('fa-minus-square');
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
             
        },

        getDOMstrings:function()    {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
//========================================================================================================
var controller = (function(BudgetCtrl, UICtrl ){ // that are below other module!!!


    var setupEventListener = function() {

        var DOM = UICtrl.getDOMstrings(); // all DOM from UIcontroller
        document.querySelector(DOM.inputBtn).addEventListener("click",ctrlAddItem);

        document.addEventListener('keypress',function(event) {
            if(event.which === 13 || event.keyCode === 13 ){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    } 

    var updateBudget = function() {
        
        // 1. Calculate budget
            BudgetController.calculateBudget();
        // 2. return budget
            var budget = BudgetController.getBudget();
        // 3. display budget on UI
            UICtrl.displayBudget(budget);
    }

    var updatePersentage = function() {
        // 1. calculate budget
        BudgetController.calculatePersentage();

        // 2. read persentages from the budget controller
        var persentages = BudgetController.getPersentage();

        // 3. update ui with the new persentages
        UICtrl.displayPersentage(persentages);

    }

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. get the filed input data
        input = UICtrl.getInput();

        if(input.desc !== "" && !isNaN(input.value) && input.value > 0) {
       
            // 2. add the item to the budget controller
            newItem = BudgetController.addItem(input.type, input.desc, input.value);

            // 3. add the item to UI controller and display
            UICtrl.addListItem(newItem,input.type);
            
            // 4. clear input 
            UICtrl.clearFields();

            //5. calculate budget update budget
            updateBudget();

            // 6.update persentages
            updatePersentage();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1.delete item from data structure
            BudgetCtrl.deleteItem(type,ID);
            
            // 2.delete item from ui
            UICtrl.deleteListItem(itemID);

            // 3.update and show the new budget
            updateBudget(); 

            // 4.update persentages
            updatePersentage();
        }
    }
  
   return {
       init:function() {
           setupEventListener();
           UICtrl.displayMonth();
           UICtrl.displayBudget({
                budget:0,
                totalIncome:0,
                totalExpenses:0,
                persentage:-1
            });
       }
   }

})(BudgetController,UIController);



// global scope!!
controller.init();
