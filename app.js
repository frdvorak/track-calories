// Storage Controller

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // Data structure / State
    const data = {
        items: [
            //{id: 0, name: 'Steak Dinner', calories: 1200},
            //{id: 1, name: 'Cookie', calories: 400},
            //{id: 2, name: 'Eggs', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }
    return { // what we return will be public
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            // Create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id + 1;
            } else {
                ID = 0;
            }
            // Callories to number
            calories = parseInt(calories);
            // Create new item
            newItem = new Item(ID, name, calories);
            // Add to items array
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total = total + item.calories; 
            });
            // Set total calories in data structure
            data.totalCalories = total;
            // Return total
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }
    // Public methods
    return {
        // In App we fetched our items from the ItemCtrl(item controller) and then used UICtrl to insert them to the interface
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `
                <li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>    
                `;
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        // Clear input fields after we add item to the list
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        // Hide UL element when needed
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display= 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display= 'none';
            document.querySelector(UISelectors.deleteBtn).style.display= 'none';
            document.querySelector(UISelectors.backBtn).style.display= 'none';
            document.querySelector(UISelectors.addBtn).style.display= 'inline';
        },
        // Make UISelectors public so we can use it in loadEventListeners later
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        // Get UISelectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);

    }
    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Clear fields
            UICtrl.clearInput();
        }
        console.log(input);
        e.preventDefault();
    }
    // Update item submit
    const itemUpdateSubmit = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual id
            const id = parseInd(listIdArr[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
        }
        e.preventDefault();
    }
    // Public methods
    return {
        // Init function, anything we need right away as the app loads
        init: function(){
            // Clear edit state / set initial state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            // Check if any items
            if(items.length===0){
                // Hide 'ul' if no items
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);


// Initialize App
App.init();