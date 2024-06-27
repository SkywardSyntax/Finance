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
const defaultTags = ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Education', 'Shopping', 'Travel', 'Other']; 

// Function to save the layout of an element to localStorage
function saveLayout(elementId) {
  const element = document.getElementById(elementId);
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

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
      // Calculate potential new position
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const rect1 = {
        left: newX,
        right: newX + card.offsetWidth,
        top: newY,
        bottom: newY + card.offsetHeight,
      };

      // Collision detection and snapping
      const otherCards = container.querySelectorAll('.budget-card, .input-card');
      for (let other of otherCards) {
        if (other !== card) {
          const rect2 = other.getBoundingClientRect();
          const collisionSide = getCollisionSide(rect1, rect2);

          if (collisionSide) {
            // Stop dragging
            isDragging = false;
            card.style.cursor = 'grab';
            card.classList.remove('dragging');

            // Snap dragged card to grid
            snapToGrid(card, other);

            // Inertial movement for the impacted card
            moveInertially(other, collisionSide, 16);

            saveLayout(elementId);
            saveLayout(other.id); 

            return;
          }
        }
      }

      // If no collision, update card position
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

    const tagsContainer = budgetItem.querySelector('.tags');
    tagsContainer.appendChild(tagElement);
}

// Function to show/hide the tag selection interface
function toggleTagSelection(budgetItem) {
    const tagsContainer = budgetItem.querySelector('.tags');
    const tagSelection = document.createElement('div'); 
    tagSelection.classList.add('tag-selection');

    defaultTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.textContent = tag;
        tagButton.addEventListener('click', () => {
            addTagToItem(budgetItem, tag);
            tagSelection.remove(); // Remove the selection interface
        });
        tagSelection.appendChild(tagButton);
    });

    tagsContainer.appendChild(tagSelection);

    tagSelection.classList.toggle('show'); // Toggle visibility
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

// Set Income Button
setIncomeButton.addEventListener('click', () => {
  totalIncome = parseFloat(annualIncomeInput.value) || 0;
  incomeValueSpan.textContent = `$${totalIncome.toFixed(2)}`;
  updateBudgetRing();
});

// Add Item Button
addItemButton.addEventListener('click', () => {
  const itemName = prompt("Enter budget item name:");
  const itemAmount = parseFloat(prompt("Enter budget amount:"));

  if (itemName && !isNaN(itemAmount) && itemAmount > 0) {
    budgetedAmount += itemAmount;

    // Create the sub-chip element
    const budgetItem = document.createElement('div');
    budgetItem.classList.add('budget-item');
    budgetItem.innerHTML = `
      <div class="budget-item-info">
          <span class="name">${itemName}</span>
          <span class="amount">$${itemAmount.toFixed(2)}</span>
      </div>
      <div class="tags"></div>
      <button class="add-tags-button">Add Tags</button>
      <button class="delete-item" data-amount="${itemAmount}">Delete</button>
    `;

    budgetItemsContainer.appendChild(budgetItem);

    // Delete budget item functionality
    const deleteButton = budgetItem.querySelector('.delete-item');
    deleteButton.addEventListener('click', () => {
      const amountToDelete = parseFloat(deleteButton.dataset.amount);
      budgetedAmount -= amountToDelete;
      budgetItem.remove();
      updateBudgetRing();
    });

    // Add tags button functionality
    const addTagsButton = budgetItem.querySelector('.add-tags-button');
    addTagsButton.addEventListener('click', () => {
        toggleTagSelection(budgetItem);
    });

    updateBudgetRing();
  }
});

// Update Budget Ring Function
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