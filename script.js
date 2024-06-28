const annualIncomeInput = document.getElementById('annual-income');
const setIncomeButton = document.getElementById('set-income');
const budgetAmountText = document.getElementById('budget-amount');
const budgetRing = document.querySelector('.budget-ring');
const budgetRingFill = document.getElementById('budget-ring-fill');
const incomeValueSpan = document.getElementById('income-value');
const budgetCategoriesContainer = document.getElementById('budget-categories-container');
const addCategoryButton = document.getElementById('add-category');
const container = document.getElementById('container');
const timePeriodChip = document.getElementById('time-period-chip');
const incomeLabel = document.getElementById('income-label');
const categoryNameInput = document.getElementById('category-name');
const categoryAmountInput = document.getElementById('category-amount');
const categorySelection = document.getElementById('category-selection');
const customCategoryField = document.getElementById('custom-category-field');

let totalIncome = 0;
let budgetedAmount = 0;
let isMonthly = true;
let selectedCategoryButton = null;
const defaultTags = ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Education', 'Shopping', 'Travel', 'Other'];
const budgetCategories = {};

// Function to save the layout of all elements to localStorage
function saveLayout() {
  const elementsToSave = ['budget-card', 'input-card', 'add-category-card', 'time-period-chip'];
  elementsToSave.forEach(elementId => {
    const element = document.getElementById(elementId);
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const position = {
      x: elementRect.left - containerRect.left,
      y: elementRect.top - containerRect.top
    };

    localStorage.setItem(elementId + '-position', JSON.stringify(position));
  });
}

// Function to load the layout of all elements from localStorage
function loadLayout() {
  const elementsToLoad = ['budget-card', 'input-card', 'add-category-card', 'time-period-chip'];
  elementsToLoad.forEach(elementId => {
    const savedPosition = localStorage.getItem(elementId + '-position');
    if (savedPosition) {
      const position = JSON.parse(savedPosition);
      const element = document.getElementById(elementId);
      element.style.left = position.x + 'px';
      element.style.top = position.y + 'px';
    }
  });
}

// Function to initialize the card position if not already set
function initializeCardPosition(elementId, defaultLeft, defaultTop) {
  const card = document.getElementById(elementId);
  if (!card.style.left || !card.style.top) {
    card.style.left = defaultLeft;
    card.style.top = defaultTop;
  }
}

// Function to check if two rectangles are colliding
function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

// Function to get the side of collision (top, bottom, left, right)
function getCollisionSide(rect1, rect2) {
  const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2);
  const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2);
  const width = (rect1.width + rect2.width) / 2;
  const height = (rect1.height + rect2.height) / 2;
  const crossWidth = width * dy;
  const crossHeight = height * dx;

  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      if (crossWidth > -crossHeight) {
        return "bottom"; 
      } else {
        return "left";
      }
    } else {
      if (crossWidth > -crossHeight) {
        return "right"; 
      } else {
        return "top"; 
      }
    }
  }
  return null;
}

// Function to move a card inertially based on collision side
function moveInertially(card, collisionSide, gap) {
  if (collisionSide === "left") {
    card.style.left = (parseFloat(card.style.left) - gap) + 'px';
  } else if (collisionSide === "right") {
    card.style.left = (parseFloat(card.style.left) + gap) + 'px';
  } else if (collisionSide === "top") {
    card.style.top = (parseFloat(card.style.top) - gap) + 'px';
  } else if (collisionSide === "bottom") {
    card.style.top = (parseFloat(card.style.top) + gap) + 'px';
  }
}

// Function to snap a card to a 16px grid from another card's border
function snapToGrid(card, otherCard) {
  const gap = 16;
  const rect1 = card.getBoundingClientRect();
  const rect2 = otherCard.getBoundingClientRect();

  const distances = {
    left: rect2.left - rect1.right,
    right: rect1.left - rect2.right,
    top: rect2.top - rect1.bottom,
    bottom: rect1.top - rect2.bottom,
  };

  const minDistanceKey = Object.keys(distances).reduce((a, b) => Math.abs(distances[a]) < Math.abs(distances[b]) ? a : b);

  if (minDistanceKey === 'left') {
    card.style.left = (rect2.left - card.offsetWidth - gap) + 'px';
    otherCard.style.left = (parseFloat(otherCard.style.left) - gap) + 'px';
  } else if (minDistanceKey === 'right') {
    card.style.left = (rect2.right + gap) + 'px';
    otherCard.style.left = (parseFloat(otherCard.style.left) + gap) + 'px';
  } else if (minDistanceKey === 'top') {
    card.style.top = (rect2.top - card.offsetHeight - gap) + 'px';
    otherCard.style.top = (parseFloat(otherCard.style.top) - gap) + 'px'; 
  } else {
    card.style.top = (rect2.bottom + gap) + 'px';
    otherCard.style.top = (parseFloat(otherCard.style.top) + gap) + 'px'; 
  }
}

// Make cards draggable
function makeDraggable(elementId) {
  const card = document.getElementById(elementId);
  const draggableArea = card.querySelector('.draggable-area'); 
  let isDragging = false;
  let offsetX, offsetY;
  let timeoutId;

  draggableArea.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - parseFloat(card.style.left || 0);
    offsetY = e.clientY - parseFloat(card.style.top || 0);

    timeoutId = setTimeout(() => {
      isDragging = true;
      card.style.cursor = 'grabbing';
      card.classList.add('dragging');
    }, 1000); 
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const rect1 = {
        left: newX,
        right: newX + card.offsetWidth,
        top: newY,
        bottom: newY + card.offsetHeight,
      };

      const otherCards = container.querySelectorAll('.budget-card, .input-card');
      for (let other of otherCards) {
        if (other !== card) {
          const rect2 = other.getBoundingClientRect();
          const collisionSide = getCollisionSide(rect1, rect2);

          if (collisionSide) {
            isDragging = false;
            card.style.cursor = 'grab';
            card.classList.remove('dragging');

            snapToGrid(card, other);

            moveInertially(other, collisionSide, 16);

            saveLayout(); 

            return;
          }
        }
      }

      card.style.left = newX + 'px';
      card.style.top = newY + 'px';
    }
  });

  document.addEventListener('mouseup', (e) => {
    clearTimeout(timeoutId);
    isDragging = false;
    card.style.cursor = 'grab';
    card.classList.remove('dragging');
  });
}

// Function to add a tag to a budget item
function addTagToItem(budgetItem, tagText) {
  const tagElement = document.createElement('span');
  tagElement.classList.add('tag');
  tagElement.textContent = tagText;

  tagElement.addEventListener('click', () => {
    tagElement.remove();
  });

  const tagsContainer = budgetItem.querySelector('.tags');
  tagsContainer.appendChild(tagElement);
}

// Function to show/hide the tag selection interface
function toggleTagSelection(parent, tagSelectionContainer) {
  const tagSelection = document.createElement('div');
  tagSelection.classList.add('tag-selection');

  defaultTags.forEach(tag => {
    const tagButton = document.createElement('button');
    tagButton.textContent = tag;
    tagButton.addEventListener('click', () => {
      addTagToItem(parent, tag);
      tagSelection.remove();
    });
    tagSelection.appendChild(tagButton);
  });

  tagSelectionContainer.appendChild(tagSelection);
  tagSelection.classList.toggle('show');
}

// Function to create a category button
function createCategoryButton(categoryName) {
  const categoryButton = document.createElement('button');
  categoryButton.textContent = categoryName;
  categoryButton.addEventListener('click', () => {
    if (selectedCategoryButton) {
      selectedCategoryButton.classList.remove('selected');
    }

    categoryButton.classList.add('selected');
    selectedCategoryButton = categoryButton; 

    categoryNameInput.value = categoryName;
    customCategoryField.style.display = 'none';
    if (categoryName === "Other") {
      customCategoryField.style.display = 'block';
    }
  });
  return categoryButton;
}

// Load layout on page load and initialize positions
loadLayout();

// Initialize card positions with default values if no saved layout
initializeCardPosition('budget-card', '400px', '50px');
initializeCardPosition('input-card', '50px', '200px');
initializeCardPosition('add-category-card', '50px', '400px');
initializeCardPosition('time-period-chip', '50%', '10px');

// Make the cards draggable
makeDraggable('budget-card');
makeDraggable('input-card');
makeDraggable('add-category-card');
makeDraggable('time-period-chip');

// Set Income Button
setIncomeButton.addEventListener('click', () => {
  totalIncome = parseFloat(annualIncomeInput.value) || 0;
  incomeValueSpan.textContent = `$${totalIncome.toFixed(2)}`;
  updateBudgetRing();
  updateCategoryAmounts();
});

// Add Category Button
addCategoryButton.addEventListener('click', () => {
  const categoryName = categoryNameInput.value; 
  let categoryAmount = parseFloat(categoryAmountInput.value);

  if (categoryName && !isNaN(categoryAmount) && categoryAmount > 0) {
    if (isMonthly) {
      categoryAmount *= 12;
    }

    if (budgetedAmount + categoryAmount > totalIncome) {
      alert("Error: Category allocation exceeds remaining budget!");
      return;
    }

    budgetedAmount += categoryAmount;

    const categoryItem = document.createElement('div');
    categoryItem.classList.add('budget-category');
    categoryItem.id = `category-${categoryName.replace(/\s+/g, '-').toLowerCase()}`; 
    categoryItem.innerHTML = `
      <div class="category-info">
          <span class="name">${categoryName}</span>
          <span class="amount">$${(categoryAmount / (isMonthly ? 12 : 1)).toFixed(2)}</span> 
      </div>
      <div class="category-items" id="items-${categoryItem.id}"></div>
      <button class="add-item-button" data-category="${categoryItem.id}">Add Item</button>
    `;
    budgetCategoriesContainer.appendChild(categoryItem);

    // Store category data
    budgetCategories[categoryItem.id] = {
      name: categoryName,
      allocated: categoryAmount,
      spent: 0,
      items: [],
    };

    // Add initial category tag to the category
    addTagToItem(categoryItem, categoryName);

    // Add item to category functionality
    const addItemToCategoryButton = categoryItem.querySelector('.add-item-button');
    addItemToCategoryButton.addEventListener('click', (event) => {
      event.stopPropagation(); 

      const categoryId = addItemToCategoryButton.dataset.category;
      const category = budgetCategories[categoryId];

      const itemName = prompt(`Enter item name for ${category.name}:`);
      let itemAmount = parseFloat(prompt(`Enter item amount for ${category.name}:`));

      if (itemName && !isNaN(itemAmount) && itemAmount > 0) {
        // Adjust item amount based on time period
        if (!isMonthly) {
          itemAmount /= 12;
        }

        if (category.spent + itemAmount > category.allocated) {
          alert(`Error: Item amount exceeds remaining budget for ${category.name}!`);
          return; 
        }

        category.spent += itemAmount;
        category.items.push({ name: itemName, amount: itemAmount });

        const categoryItemsContainer = document.getElementById(`items-${categoryId}`);
        const budgetItem = document.createElement('div');
        budgetItem.classList.add('budget-item');
        budgetItem.innerHTML = `
          <div class="budget-item-info">
            <span class="name">${itemName}</span>
            <span class="amount">$${(itemAmount * (isMonthly ? 1 : 12)).toFixed(2)}</span> 
          </div>
          <div class="tags"></div>
          <button class="add-tags-button">Add Tags</button>
          <button class="delete-item" data-amount="${itemAmount}" data-category="${categoryId}">Delete</button>
        `;
        categoryItemsContainer.appendChild(budgetItem);

        // Add the category tag to the item
        addTagToItem(budgetItem, categoryName); 

        // Delete budget item functionality
        const deleteButton = budgetItem.querySelector('.delete-item');
        deleteButton.addEventListener('click', () => {
          const amountToDelete = parseFloat(deleteButton.dataset.amount);
          const categoryId = deleteButton.dataset.category;
          const category = budgetCategories[categoryId];
          category.spent -= amountToDelete;
          category.items = category.items.filter(item => item.amount !== amountToDelete);
          budgetItem.remove();
          updateCategoryAmount(categoryId); 
          updateBudgetRing();
        });

        // Add tags button functionality
        const addTagsButton = budgetItem.querySelector('.add-tags-button');
        addTagsButton.addEventListener('click', (event) => {
          // Stop propagation to prevent dragging the parent category chip
          event.stopPropagation(); 

          const tagSelectionContainer = budgetItem.querySelector('.tags'); 
          toggleTagSelection(budgetItem, tagSelectionContainer);
        });

        updateCategoryAmount(categoryId);
        updateBudgetRing();
      }
    });

    updateCategoryAmount(categoryItem.id); 
    updateBudgetRing(); 
    categoryNameInput.value = '';
    categoryAmountInput.value = ''; 
  }
});

// Update Budget Ring Function
function updateBudgetRing() {
  const remainingAmount = totalIncome - budgetedAmount;
  let percentage = (remainingAmount / totalIncome) * 100;
  if (isNaN(percentage)) {
    percentage = 100; 
  }
  let deg = (percentage / 100) * 360;
  deg = deg - 90; 

  // Update the ring fill's rotation for depletion
  budgetRingFill.style.transform = `rotate(${deg}deg)`;

  budgetAmountText.textContent = `$${remainingAmount.toFixed(2)}`;

  // Dynamically set the border color based on the percentage
  if (percentage <= 10) {
    budgetRingFill.style.backgroundColor = 'red'; 
  } else if (percentage <= 50) {
    budgetRingFill.style.backgroundColor = 'yellow';
  } else {
    budgetRingFill.style.backgroundColor = 'green'; 
  }

  // Adjust font size to fit
  if (remainingAmount.toString().length > 8) {
    budgetAmountText.style.fontSize = "1.5rem";
  } else if (remainingAmount.toString().length > 6) {
    budgetAmountText.style.fontSize = "2rem";
  } else {
    budgetAmountText.style.fontSize = "2.5rem";
  }
}

// Update Category Amount Function
function updateCategoryAmount(categoryId) {
  const category = budgetCategories[categoryId];
  const categoryAmountSpan = document.querySelector(`#${categoryId} .amount`);

  const displayAmount = isMonthly ? category.allocated / 12 : category.allocated;
  categoryAmountSpan.textContent = `$${(displayAmount - category.spent * (isMonthly ? 1 : 12)).toFixed(2)}`; 
}

// Update all category amounts (used when time period changes)
function updateCategoryAmounts() {
  for (const categoryId in budgetCategories) {
    updateCategoryAmount(categoryId);
  }
}

// Time Period Chip Functionality
timePeriodChip.addEventListener('click', () => {
  isMonthly = !isMonthly; 
  timePeriodChip.querySelector('.label').textContent = isMonthly ? 'Monthly' : 'Yearly';

  // Update income label
  incomeLabel.textContent = `Enter Your ${isMonthly ? 'Monthly' : 'Annual'} Income`;

  // Update budget amount and category amounts
  updateBudgetRing(); 
  updateCategoryAmounts(); 
});

// Populate Category Selection buttons
defaultTags.forEach(tag => {
  const button = createCategoryButton(tag);
  categorySelection.appendChild(button);
});

// Add "Other" button for custom category
categorySelection.appendChild(createCategoryButton("Other"));