<script lang="ts">
  import BudgetRing from './lib/BudgetRing.svelte';
  import IncomeInput from './lib/IncomeInput.svelte';
  import CategoryCreator from './lib/CategoryCreator.svelte';
  import TimePeriodChip from './lib/TimePeriodChip.svelte';
  import { dragging } from './lib/store.js';

  let totalIncome = 0;
  let budgetedAmount = 0;
  let isMonthly = true;

  const items = [
    { id: 'budget-card', x: 400, y: 50 },
    { id: 'input-card', x: 50, y: 200 },
    { id: 'add-category-card', x: 50, y: 400 },
    { id: 'time-period-chip', x: 50, y: 10 }, 
  ];

  const updateBudgetedAmount = (event: CustomEvent<number>) => {
    budgetedAmount += event.detail; 
  };

  const handleMouseDown = (event: MouseEvent) => {
    // Prevent dragging on interactive elements
    if (
      (event.target as HTMLElement).tagName === 'BUTTON' ||
      (event.target as HTMLElement).tagName === 'INPUT'
    ) {
      return;
    }
    dragging.set(true);
  };

  const handleMouseUp = () => {
    dragging.set(false);
  };

  // Function to save layout to localStorage
  const saveLayout = () => {
    localStorage.setItem('layout', JSON.stringify(items));
  };

  // Function to load layout from localStorage
  const loadLayout = () => {
    const savedLayout = localStorage.getItem('layout');
    if (savedLayout) {
      const parsedLayout = JSON.parse(savedLayout);
      // Update the items array with the saved positions
      items.forEach(item => {
        const savedItem = parsedLayout.find((i: any) => i.id === item.id);
        if (savedItem) {
          item.x = savedItem.x;
          item.y = savedItem.y;
        }
      });
    }
  };

  // Load layout on component mount
  loadLayout();
</script>

<main on:mousedown={handleMouseDown} on:mouseup={handleMouseUp}>
  {#each items as item (item.id)}
    <div
      class="chip-container"
      style="position: absolute; left: {item.x}px; top: {item.y}px;"
    >
      {#if item.id === 'time-period-chip'}
        <TimePeriodChip bind:isMonthly {item} on:dragend={saveLayout} />
      {:else if item.id === 'budget-card'}
        <BudgetRing {totalIncome} {budgetedAmount} {item} on:dragend={saveLayout} />
      {:else if item.id === 'input-card'}
        <IncomeInput bind:totalIncome {item} on:dragend={saveLayout} />
      {:else if item.id === 'add-category-card'}
        <CategoryCreator
          {isMonthly}
          on:updateBudgeted={updateBudgetedAmount}
          {item}
          on:dragend={saveLayout}
        />
      {/if}
    </div>
  {/each}
</main>

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    background-color: #121212;
    color: #eee;
    height: 100vh;
  }

  .chip-container {
    z-index: 1;
  }
</style>