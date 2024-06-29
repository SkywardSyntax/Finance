<script lang="ts">
  import GridLayout from 'svelte-grid-layout';
  import BudgetInput from './lib/BudgetInput.svelte';
  import TransactionList from './lib/TransactionList.svelte';
  import BudgetDisplay from './lib/BudgetDisplay.svelte';

  let balance = 0;
  let transactions: { description: string; amount: number }[] = [];

  // Define the layout (using svelte-grid-layout's format)
  let layout = [
    { w: 1, h: 1, x: 0, y: 0, i: 'budget-display' }, 
    { w: 1, h: 1, x: 1, y: 0, i: 'transaction-list' },
    { w: 2, h: 1, x: 0, y: 1, i: 'budget-input' } 
  ];

  const handleAddTransaction = (event: CustomEvent<{ description: string; amount: number }>) => {
    transactions = [...transactions, event.detail];
    updateBalance(event.detail.amount);
  };

  const updateBalance = (amount: number) => {
    balance += amount;
  };

  // Function to render the component based on its ID
  const renderComponent = (id: string) => {
    switch (id) {
      case 'budget-display':
        return BudgetDisplay;
      case 'transaction-list':
        return TransactionList;
      case 'budget-input':
        return BudgetInput;
      default:
        return null;
    }
  };

  // Load and save the layout
  function loadLayout() {
    const savedLayout = localStorage.getItem('grid-layout');
    if (savedLayout) {
      layout = JSON.parse(savedLayout);
    }
  }

  function saveLayout() {
    localStorage.setItem('grid-layout', JSON.stringify(layout));
  }

  // Load layout on mount
  loadLayout();

  // Save layout whenever it changes
  $: {
    saveLayout();
  }

</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <GridLayout bind:layout cols={2}>
    {#each layout as item (item.i)}
      <div slot="item" data-id={item.i}>
        <svelte:component this={renderComponent(item.i)} {balance} {transactions} on:add={handleAddTransaction} />
      </div>
    {/each}
  </GridLayout>
</main>