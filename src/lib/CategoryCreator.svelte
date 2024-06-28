<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';

  export let isMonthly: boolean;
  export let item: { id: string; x: number; y: number };

  const dispatch = createEventDispatcher();

  interface BudgetCategory {
    name: string;
    allocated: number;
    spent: number;
    items: { name: string; amount: number }[];
  }

  const budgetCategories: { [key: string]: BudgetCategory } = {};
  let budgetCategoriesContainer: HTMLDivElement;

  const defaultTags: string[] = [
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
  let selectedCategoryButton: HTMLButtonElement | null = null;
  let customCategoryName = '';

  const handleDndUpdate = ({ detail }: { detail: { x: number; y: number } }) => {
    item.x = detail.x;
    item.y = detail.y;
    dispatch('dragend');
  };

  const handleCategoryButtonClick = (categoryName: string) => {
    if (selectedCategoryButton) {
      selectedCategoryButton.classList.remove('selected');
    }
    selectedCategoryButton = event.target as HTMLButtonElement;
    selectedCategoryButton.classList.add('selected');

    categoryNameInput = categoryName;
    customCategoryName = '';

    if (categoryName === 'Other') {
      (document.getElementById('custom-category-field') as HTMLDivElement).style.display = 'block';
    } else {
      (document.getElementById('custom-category-field') as HTMLDivElement).style.display = 'none';
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
            <span class="amount" data-allocated="${categoryAmount}">$${(
        categoryAmount /
        (isMonthly ? 12 : 1)
      ).toFixed(2)}</span>
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

      addTagToItem(categoryItem, categoryName);

      const addItemToCategoryButton =
        categoryItem.querySelector('.add-item-button') as HTMLButtonElement;
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
          ) as HTMLDivElement;
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

          addTagToItem(budgetItem, categoryName); 

          const deleteButton = budgetItem.querySelector(
            '.delete-item'
          ) as HTMLButtonElement;
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
            dispatch('updateBudgeted', -amountToDelete); 
          });

          const addTagsButton = budgetItem.querySelector(
            '.add-tags-button'
          ) as HTMLButtonElement;
          addTagsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const tagSelectionContainer =
              budgetItem.querySelector('.tags') as HTMLDivElement;
            toggleTagSelection(budgetItem, tagSelectionContainer);
          });

          updateCategoryAmount(categoryId);
          dispatch('updateBudgeted', 0);
        }
      });

      updateCategoryAmount(categoryItem.id); 
      categoryNameInput = ''; 
      categoryAmountInput = '';
      customCategoryName = ''; 
    }
  };

  const updateCategoryAmount = (categoryId: string) => {
    // ... (same as before)
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
>
  <div class="draggable-area" on:mousedown={() => dragging.set(true)} on:mouseup={() => dragging.set(false)}
  style="cursor: {$dragging ? 'grabbing' : 'grab'}"></div>
  <h2>Create Budget Categories</h2>
  <div class="category-selection" id="category-selection">
    {#each defaultTags as tag}
      <button on:click={() => handleCategoryButtonClick(tag)}>
        {tag}
      </button>
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
</div>