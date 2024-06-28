<script>
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';

  export let isMonthly;
  export let item; 

  const dispatch = createEventDispatcher();

  const budgetCategories = {};
  let budgetCategoriesContainer;

  const defaultTags = [
    'Food',
    'Rent',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Education',
    'Shopping',
    'Travel',
    'Other',
  ];

  let categoryNameInput = '';
  let categoryAmountInput = '';
  let selectedCategoryButton = null;
  let customCategoryName = '';

  const handleDndUpdate = ({ detail }) => {
    item.x = detail.x;
    item.y = detail.y;
  };

  const handleCategoryButtonClick = (categoryName) => {
    // Deselect previous button 
    if (selectedCategoryButton) {
      selectedCategoryButton.classList.remove('selected');
    }

    selectedCategoryButton = event.target;
    selectedCategoryButton.classList.add('selected');

    categoryNameInput = categoryName;
    customCategoryName = '';

    if (categoryName === 'Other') {
      document.getElementById('custom-category-field').style.display = 'block';
    } else {
      document.getElementById('custom-category-field').style.display = 'none';
    }
  };

  const handleAddCategory = () => {
    const categoryName =
      categoryNameInput === 'Other' ? customCategoryName : categoryNameInput;
    let categoryAmount = parseFloat(categoryAmountInput);

    if (categoryName && !isNaN(categoryAmount) && categoryAmount > 0) {
      if (isMonthly) {
        categoryAmount *= 12;
      }

      dispatch('updateBudgeted', categoryAmount); 

      const categoryItem = document.createElement('div');
      categoryItem.classList.add('budget-category');
      categoryItem.id = `category-${categoryName
        .replace(/\s+/g, '-')
        .toLowerCase()}`;
      categoryItem.innerHTML = `
        <div class="category-info">
            <span class="name">${categoryName}</span>
            <span class="amount" data-allocated="${
              categoryAmount
            }">$${(categoryAmount / (isMonthly ? 12 : 1)).toFixed(2)}</span>
        </div>
        <div class="category-items" id="items-${categoryItem.id}"></div>
        <button class="add-item-button" data-category="${
          categoryItem.id
        }">Add Item</button>
      `;
      budgetCategoriesContainer.appendChild(categoryItem);

      budgetCategories[categoryItem.id] = {
        name: categoryName,
        allocated: categoryAmount,
        spent: 0,
        items: [],
      };

      // Add initial category tag to the category
      addTagToItem(categoryItem, categoryName); 

      const addItemToCategoryButton =
        categoryItem.querySelector('.add-item-button');
      addItemToCategoryButton.addEventListener('click', (event) => {
        event.stopPropagation(); 

        const categoryId = addItemToCategoryButton.dataset.category;
        const category = budgetCategories[categoryId];

        const itemName = prompt(`Enter item name for ${category.name}:`);
        let itemAmount = parseFloat(
          prompt(`Enter item amount for ${category.name}:`)
        );

        if (itemName && !isNaN(itemAmount) && itemAmount > 0) {
          if (!isMonthly) {
            itemAmount /= 12; 
          }

          if (category.spent + itemAmount > category.allocated) {
            alert(
              `Error: Item amount exceeds remaining budget for ${category.name}!`
            );
            return;
          }

          category.spent += itemAmount;
          category.items.push({ name: itemName, amount: itemAmount });

          const categoryItemsContainer = document.getElementById(
            `items-${categoryId}`
          );
          const budgetItem = document.createElement('div');
          budgetItem.classList.add('budget-item');
          budgetItem.innerHTML = `
            <div class="budget-item-info">
              <span class="name">${itemName}</span>
              <span class="amount">$${(
                itemAmount *
                (isMonthly ? 1 : 12)
              ).toFixed(2)}</span> 
            </div>
            <div class="tags"></div>
            <button class="add-tags-button">Add Tags</button>
            <button class="delete-item" data-amount="${itemAmount}" data-category="${categoryId}">Delete</button>
          `;
          categoryItemsContainer.appendChild(budgetItem);

          // Add the category tag to the new item
          addTagToItem(budgetItem, categoryName); 

          const deleteButton = budgetItem.querySelector('.delete-item');
          deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();

            const amountToDelete = parseFloat(deleteButton.dataset.amount);
            const categoryId = deleteButton.dataset.category;
            const category = budgetCategories[categoryId];

            category.spent -= amountToDelete;
            category.items = category.items.filter(
              (item) => item.amount !== amountToDelete
            );

            budgetItem.remove();
            updateCategoryAmount(categoryId);
            dispatch('updateBudgeted', -amountToDelete); // Update the budget when an item is deleted
          });

          const addTagsButton = budgetItem.querySelector('.add-tags-button');
          addTagsButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const tagSelectionContainer =
              budgetItem.querySelector('.tags');
            toggleTagSelection(budgetItem, tagSelectionContainer);
          });

          updateCategoryAmount(categoryId);
          dispatch('updateBudgeted', 0); // Emit an event to update the BudgetRing
        }
      });

      updateCategoryAmount(categoryItem.id);
      categoryNameInput = ''; 
      categoryAmountInput = '';
      customCategoryName = '';
    }
  };

  const addTagToItem = (budgetItem, tagText) => {
    const tagElement = document.createElement('span');
    tagElement.classList.add('tag');
    tagElement.textContent = tagText;
    tagElement.addEventListener('click', () => {
      tagElement.remove();
    });

    const tagsContainer = budgetItem.querySelector('.tags');
    tagsContainer.appendChild(tagElement);
  };

  const toggleTagSelection = (parent, tagSelectionContainer) => {
    const tagSelection = document.createElement('div');
    tagSelection.classList.add('tag-selection');

    defaultTags.forEach((tag) => {
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
  };

  const updateCategoryAmount = (categoryId) => {
    const category = budgetCategories[categoryId];
    const categoryAmountSpan = document.querySelector(
      `#${categoryId} .amount`
    );
    const allocatedAmount = parseFloat(categoryAmountSpan.dataset.allocated);
    const displayAmount = isMonthly
      ? allocatedAmount / 12
      : allocatedAmount;
    categoryAmountSpan.textContent = `$${(
      displayAmount -
      category.spent * (isMonthly ? 1 : 12)
    ).toFixed(2)}`;
  };
</script>

<div
  class="budget-card add-category-card" 
  id="add-category-card"
  bind:this={budgetCategoriesContainer}
  use:dndzone={{
    items: [{ id: item.id }],
    flipDurationMs: 200,
  }}
  on:dndzone:reorder={handleDndUpdate}
  style="cursor: {$dragging ? 'grabbing' : 'grab'}"
>
  <h2>Create Budget Categories</h2>
  <div class="category-selection" id="category-selection">
    {#each defaultTags as tag}
      <button on:click={() => handleCategoryButtonClick(tag)}>{tag}</button>
    {/each}
    <button on:click={() => handleCategoryButtonClick('Other')}>
      Other
    </button>
  </div>
  <div class="input-field" id="custom-category-field" style="display: none;">
    <input
      type="text"
      id="category-name"
      placeholder="Custom Category Name"
      bind:value={customCategoryName}
    />
  </div>
  <div class="input-field">
    <input
      type="number"
      id="category-amount"
      placeholder="Allocated Amount"
      bind:value={categoryAmountInput}
    />
  </div>
  <button id="add-category" on:click={handleAddCategory}>
    Add Category
  </button>

  <!-- This div should be outside the draggable area -->
  <div class="budget-categories" /> 
</div>

<style>
  .add-category-card { /* Targets the card specifically */
    background-color: #202020;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: fit-content;
    z-index: 1;
  }

  h2 {
    color: #eee;
    margin-bottom: 15px;
  }

  /* --- Category Selection --- */
  .category-selection {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .category-selection button {
    background-color: #5bc0de;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    width: fit-content;
    min-width: 80px;
    transition: background-color 0.2s;
  }

  .category-selection button.selected {
    background-color: #31b0d5;
  }

  .category-selection button:hover {
    background-color: #46b8da;
  }

  /* --- Input Fields --- */
  .input-field {
    margin-bottom: 10px;
  }

  input[type='number'],
  input[type='text'] {
    width: calc(100% - 16px);
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #555;
    background-color: #444;
    color: #eee;
    margin-bottom: 10px;
  }

  /* --- Button Styles --- */
  button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }

  /* --- Budget Categories --- */
  .budget-categories {
    margin-top: 20px;
  }

  .budget-category {
    background-color: #333;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    width: fit-content;
  }

  .category-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .budget-category .name {
    font-size: 0.9rem;
    color: #eee;
  }

  .budget-category .amount {
    font-size: 0.8rem;
    color: #ccc;
  }

  .category-items {
    margin-top: 10px;
  }

  /* --- Budget Items --- */
  .budget-item {
    background-color: #444;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: fit-content;
  }

  .budget-item .name {
    font-size: 0.8rem;
    color: #eee;
  }

  .budget-item .amount {
    font-size: 0.7rem;
    color: #ccc;
  }

  /* --- Add Item Button --- */
  .add-item-button {
    background-color: #5cb85c;
    border: none;
    color: white;
    padding: 6px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 0.8rem;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;
    margin-top: 8px;
    align-self: flex-end;
  }

  .add-item-button:hover {
    background-color: #4cae4c;
  }

  /* --- Tag Styles --- */
  .tag {
    background-color: #5bc0de;
    color: white;
    padding: 3px 6px;
    border-radius: 5px;
    font-size: 0.7rem;
    cursor: pointer;
    margin-left: 8px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  /* --- Delete Button --- */
  .delete-item {
    background-color: #f44336;
    padding: 6px 12px;
    font-size: 0.8rem;
    margin-left: 5px; 
  }

  .delete-item:hover {
    background-color: #d32f2f;
  }

  /* --- Tag Selection --- */
  .tag-selection {
    display: none;
    position: absolute;
    background-color: #202020;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 3; 
    margin-top: 5px;
  }

  .tag-selection.show {
    display: block;
  }

  .tag-selection button {
    background-color: #5bc0de;
    color: white;
    border: none;
    padding: 5px 10px;
    margin: 5px 0;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    width: calc(100% - 10px);
    transition: background-color 0.2s;
  }

  .tag-selection button:hover {
    background-color: #46b8da;
  }
</style>