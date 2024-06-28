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
    { id: 'input-card', x: 50, y: 50 },
    { id: 'add-category-card', x: 50, y: 250 },
    { id: 'time-period-chip', x: 200, y: 10 }, // Changed x to number
  ];

  const updateBudgetedAmount = (newAmount: number) => {
    budgetedAmount += newAmount;
  };

  const handleMouseDown = () => {
    dragging.set(true);
  };

  const handleMouseUp = () => {
    dragging.set(false);
  };
</script>

<main on:mousedown={handleMouseDown} on:mouseup={handleMouseUp}>
  {#each items as item (item.id)}
    <div style="position: absolute; left: {item.x}px; top: {item.y}px;">
      {#if item.id === 'time-period-chip'}
        <TimePeriodChip bind:isMonthly {item} />
      {:else if item.id === 'budget-card'}
        <BudgetRing {totalIncome} {budgetedAmount} {item} />
      {:else if item.id === 'input-card'}
        <IncomeInput bind:totalIncome {item} />
      {:else if item.id === 'add-category-card'}
        <CategoryCreator {isMonthly} on:updateBudgeted={updateBudgetedAmount} {item} />
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
</style>