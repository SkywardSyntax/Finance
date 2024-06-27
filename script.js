const annualIncomeInput = document.getElementById('annual-income');
const setIncomeButton = document.getElementById('set-income');
const budgetAmountText = document.getElementById('budget-amount');
const budgetRing = document.querySelector('.budget-ring');
const incomeValueSpan = document.getElementById('income-value');
const budgetItemsContainer = document.getElementById('budget-items-container');
const addItemButton = document.getElementById('add-item');
const container = document.getElementById('container');

let totalIncome = 0;
let budgetedAmount = 0;

// Function to save the layout of an element to localStorage
function saveLayout(elementId) {
  const element = document.getElementById(elementId);
  const position = {
    x: element.offsetLeft,
    y: element.offsetTop
  };
  localStorage.setItem(elementId + '-position', JSON.stringify(position));
}

// Function to load the layout of an element from localStorage
function loadLayout(elementId) {
  const savedPosition = localStorage.getItem(elementId + '-position');
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    const element = document.getElementById(elementId);
    element.style.left = position.x + 'px';
    element.style.top = position.y + 'px';
  }
}

// Function to check for collisions between two elements
function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

const annualIncomeInput = document.getElementById('annual-income');
const setIncomeButton = document.getElementById('set-income');
const budgetAmountText = document.getElementById('budget-amount');
const budgetRing = document.querySelector('.budget-ring');
const incomeValueSpan = document.getElementById('income-value');
const budgetItemsContainer = document.getElementById('budget-items-container');
const addItemButton = document.getElementById('add-item');
const container = document.getElementById('container');

let totalIncome = 0;
let budgetedAmount = 0;

// Function to save the layout of an element to localStorage
function saveLayout(elementId) {
    const element = document.getElementById(elementId);
    const position = {
      x: element.offsetLeft,
      y: element.offsetTop
    };
    localStorage.setItem(elementId + '-position', JSON.stringify(position));
  }
  
  // Function to load the layout of an element from localStorage
  function loadLayout(elementId) {
    const savedPosition = localStorage.getItem(elementId + '-position');
    if (savedPosition) {
      const position = JSON.parse(savedPosition);
      const element = document.getElementById(elementId);
      element.style.left = position.x + 'px';
      element.style.top = position.y + 'px';
    }
  }

// Function to check if a point is inside a rectangle
function isPointInRect(x, y, rect) {
    return (
      x > rect.left &&
      x < rect.right &&
      y > rect.top &&
      y < rect.bottom
    );
}

// Function to get the overlapping area between two rectangles
function getOverlapArea(rect1, rect2) {
  const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
  const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
  return xOverlap * yOverlap;
}

const annualIncomeInput = document.getElementById('annual-income');
const setIncomeButton = document.getElementById('set-income');
const budgetAmountText = document.getElementById('budget-amount');
const budgetRing = document.querySelector('.budget-ring');
const incomeValueSpan = document.getElementById('income-value');
const budgetItemsContainer = document.getElementById('budget-items-container');
const addItemButton = document.getElementById('add-item');
const container = document.getElementById('container');

let totalIncome = 0;
let budgetedAmount = 0;

// Function to save the layout of an element to localStorage
function saveLayout(elementId) {
  const element = document.getElementById(elementId);
  const position = {
    x: element.offsetLeft,
    y: element.offsetTop
  };
  localStorage.setItem(elementId + '-position', JSON.stringify(position));
}

// Function to load the layout of an element from localStorage
function loadLayout(elementId) {
  const savedPosition = localStorage.getItem(elementId + '-position');
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    const element = document.getElementById(elementId);
    element.style.left = position.x + 'px';
    element.style.top = position.y + 'px';
  }
}

// Function to check if a point is inside a rectangle
function isPointInRect(x, y, rect) {
  return (
    x > rect.left &&
    x < rect.right &&
    y > rect.top &&
    y < rect.bottom
  );
}

// Function to get the overlapping area between two rectangles
function getOverlapArea(rect1, rect2) {
  const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
  const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
  return xOverlap * yOverlap;
}

function makeDraggable(elementId) {
  const card = document.getElementById(elementId);
  let isDragging = false;
  let offsetX, offsetY;
  let timeoutId;

  card.addEventListener('mousedown', (e) => {
    if (e.target === card) {
      offsetX = e.clientX - card.getBoundingClientRect().left; // Calculate offsetX on mousedown
      offsetY = e.clientY - card.getBoundingClientRect().top; // Calculate offsetY on mousedown
      timeoutId = setTimeout(() => {
        isDragging = true;
        card.style.cursor = 'grabbing';
        card.classList.add('dragging');
      }, 1000);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      // Use the initially calculated offsetX and offsetY for position calculation
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // Collision detection and other logic remain the same...

      // Update card position
      card.style.left = newX + 'px';
      card.style.top = newY + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    clearTimeout(timeoutId);
    isDragging = false;
    card.style.cursor = 'grab';
    card.classList.remove('dragging');
    saveLayout(elementId);
  });
}

// Load layout on page load
loadLayout('budget-card');
loadLayout('input-card');
loadLayout('budget-items-card');

// Make the cards draggable
makeDraggable('budget-card');
makeDraggable('input-card');
makeDraggable('budget-items-card');

setIncomeButton.addEventListener('click', () => {
    totalIncome = parseFloat(annualIncomeInput.value) || 0;
    incomeValueSpan.textContent = `$${totalIncome.toFixed(2)}`;
    updateBudgetRing();
});

addItemButton.addEventListener('click', () => {
    const itemName = prompt("Enter budget item name:");
    const itemAmount = parseFloat(prompt("Enter budget amount:"));

    if (itemName && !isNaN(itemAmount) && itemAmount > 0) {
        budgetedAmount += itemAmount;

        const budgetItem = document.createElement('div');
        budgetItem.classList.add('budget-item');
        budgetItem.innerHTML = `
            <span>${itemName}: $${itemAmount.toFixed(2)}</span>
            <button class="delete-item" data-amount="${itemAmount}">Delete</button>
        `;

        budgetItemsContainer.appendChild(budgetItem);

        const deleteButton = budgetItem.querySelector('.delete-item');
        deleteButton.addEventListener('click', () => {
            const amountToDelete = parseFloat(deleteButton.dataset.amount);
            budgetedAmount -= amountToDelete;
            budgetItem.remove();
            updateBudgetRing();
        });

        updateBudgetRing();
    }
});

function updateBudgetRing() {
    const remainingAmount = totalIncome - budgetedAmount;
    const percentage = (remainingAmount / totalIncome) * 100;
    const deg = (percentage / 100) * 360;

    budgetRing.style.setProperty('--progress-deg', `${deg}deg`);
    budgetAmountText.textContent = `$${remainingAmount.toFixed(2)}`;

    // Adjust font size to fit
    if (remainingAmount.toString().length > 8) {
        budgetAmountText.style.fontSize = "1.5rem";
    } else if (remainingAmount.toString().length > 6) {
        budgetAmountText.style.fontSize = "2rem";
    } else {
        budgetAmountText.style.fontSize = "2.5rem";
    }
}