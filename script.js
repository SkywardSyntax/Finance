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
  const containerRect = container.getBoundingClientRect(); // Get container's position
  const elementRect = element.getBoundingClientRect(); // Get element's position

  // Calculate position relative to the container
  const position = {
    x: elementRect.left - containerRect.left,
    y: elementRect.top - containerRect.top
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

// Function to initialize the card position if not already set
function initializeCardPosition(elementId) {
  const card = document.getElementById(elementId);
  if (!card.style.left || !card.style.top) {
    card.style.left = '10px';
    card.style.top = '10px';
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

// Make cards draggable
function makeDraggable(elementId) {
  const card = document.getElementById(elementId);
  let isDragging = false;
  let offsetX, offsetY;
  let timeoutId;

  card.addEventListener('mousedown', (e) => {
    if (e.target === card) {
      offsetX = e.clientX - parseFloat(card.style.left || 0);
      offsetY = e.clientY - parseFloat(card.style.top || 0);

      timeoutId = setTimeout(() => {
        isDragging = true;
        card.style.cursor = 'grabbing';
        card.classList.add('dragging');
      }, 1000); 
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      card.style.left = (e.clientX - offsetX) + 'px';
      card.style.top = (e.clientY - offsetY) + 'px'; 
    }
  });

  document.addEventListener('mouseup', (e) => {
    clearTimeout(timeoutId);
    isDragging = false;
    card.style.cursor = 'grab';
    card.classList.remove('dragging');

    // Snapping to 16px grid on mouseup:
    const gap = 16; 
    const otherCards = container.querySelectorAll('.budget-card, .input-card');
    for (let other of otherCards) {
      if (other !== card) {
        const rect1 = card.getBoundingClientRect();
        const rect2 = other.getBoundingClientRect();

        // Check for collisions and snap
        if (checkCollision(rect1, rect2)) {
          // Calculate distances to other card's edges
          const distances = {
            left: rect2.left - rect1.right,
            right: rect1.left - rect2.right,
            top: rect2.top - rect1.bottom,
            bottom: rect1.top - rect2.bottom,
          };

          // Find the smallest distance and adjust accordingly
          const minDistanceKey = Object.keys(distances).reduce((a, b) => Math.abs(distances[a]) < Math.abs(distances[b]) ? a : b);
          
          if (minDistanceKey === 'left') {
            card.style.left = (rect2.left - card.offsetWidth - gap) + 'px';
          } else if (minDistanceKey === 'right') {
            card.style.left = (rect2.right + gap) + 'px';
          } else if (minDistanceKey === 'top') {
            card.style.top = (rect2.top - card.offsetHeight - gap) + 'px';
          } else {
            card.style.top = (rect2.bottom + gap) + 'px';
          }
        }
      }
    }

    saveLayout(elementId); 
  });
}

// Load layout on page load and initialize positions
loadLayout('budget-card');
loadLayout('input-card');
loadLayout('budget-items-card');

// Initialize card positions if they haven't been loaded from localStorage
initializeCardPosition('budget-card');
initializeCardPosition('input-card');
initializeCardPosition('budget-items-card');

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