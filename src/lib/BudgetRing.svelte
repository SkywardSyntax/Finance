<script lang="ts">
  export let totalIncome: number;
  export let budgetedAmount: number;
  export let item: { id: string; x: number; y: number };
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';

  $: remainingAmount = totalIncome - budgetedAmount;
  $: percentage = (remainingAmount / totalIncome) * 100 || 100;
  $: deg = (percentage / 100) * 360 - 90;
  $: ringColor = percentage <= 10 ? 'red' : percentage <= 50 ? 'yellow' : 'green';
  $: amountTextSize =
    remainingAmount.toString().length > 8
      ? '1.5rem'
      : remainingAmount.toString().length > 6
      ? '2rem'
      : '2.5rem';

  const handleDndUpdate = ({ detail }: { detail: { x: number; y: number } }) => {
    item.x = detail.x;
    item.y = detail.y;
  };
</script>

<div
  class="budget-card"
  use:dndzone={{
    items: [{ id: item.id }],
    flipDurationMs: 200,
  }}
  on:dndzone:reorder={handleDndUpdate}
  on:mousedown={() => dragging.set(true)} 
  on:mouseup={() => dragging.set(false)}
  style="cursor: {$dragging ? 'grabbing' : 'grab'}"
>
  <div class="ring-container">
    <div class="budget-info">
      <div class="label">Remaining Budget</div>
      <div class="budget-amount" style="font-size: {amountTextSize}">
        ${remainingAmount.toFixed(2)}
      </div>
      <div class="income-info">
        <span class="label">Income:</span>
        <span class="value">${totalIncome.toFixed(2)}</span>
      </div>
    </div>
    <div class="budget-ring">
      <div class="pulse-container">
        <div class="inner-circle" />
      </div>
      <div
        class="budget-ring-fill"
        style="transform: rotate({deg}deg); background-color: {ringColor}"
      />
    </div>
  </div>
  <div class="label">Budget Categories</div>
  <div class="budget-categories">
    <!-- Budget categories will go here -->
  </div>
</div>

<style>
  .budget-card {
    background-color: #202020;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: fit-content;
    z-index: 1;
  }

  .ring-container {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .budget-ring {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: transparent;
    position: relative;
    overflow: hidden;
    margin-left: 20px;
  }

  .budget-ring-fill {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background-color: green;
    z-index: 1;
    transition: background-color 0.5s ease-in-out, transform 0.5s ease-in-out;
    transform-origin: center;
    transform: rotate(-90deg);
  }

  .pulse-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inner-circle {
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: #f0ad4e;
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
    }
    50% {
      transform: scale(1.0);
    }
    100% {
      transform: scale(0.95);
    }
  }

  .budget-info {
    text-align: right;
    margin-bottom: 20px;
  }

  .budget-amount {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    white-space: nowrap;
    margin-bottom: 10px;
  }

  .income-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .label {
    font-size: 0.9rem;
    color: #ddd;
    font-weight: bold;
  }

  .value {
    font-size: 1rem;
    font-weight: bold;
  }
</style>