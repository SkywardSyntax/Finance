<script lang="ts">
  import BudgetInput from './lib/BudgetInput.svelte';
  import TransactionList from './lib/TransactionList.svelte';
  import BudgetDisplay from './lib/BudgetDisplay.svelte';

  // Define the Item type
  type Item = {
    id: string; // Unique identifier
  };

  let balance: number = 0;
  let transactions: { description: string; amount: number }[] = [];
  let layout: Item[] = loadLayout() || [
    { id: 'budget-display' }, 
    { id: 'transaction-list' } 
  ];

  let dragging: Item | null = null;
  let targetIndex: number = -1; 

  const handleAddTransaction = (event: CustomEvent<{ description: string; amount: number }>) => {
    const transaction = event.detail;
    transactions = [...transactions, transaction];
    updateBalance(transaction.amount);
  };

  const updateBalance = (amount: number) => {
    balance += amount;
  };

  const handleDragStart = (event: DragEvent, index: number) => {
    setTimeout(() => {
      dragging = layout[index];
      event.dataTransfer!.setDragImage(new Image(), 0, 0);
    }, 1000);
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    targetIndex = index; 
  };

  const handleDragEnd = () => {
    if (dragging && targetIndex !== -1) {
      const newLayout = [...layout];
      const dragStartIndex = newLayout.findIndex(item => item.id === dragging.id);

      if (dragStartIndex > -1) { 
        newLayout.splice(dragStartIndex, 1); 
        newLayout.splice(targetIndex, 0, dragging); 
        layout = newLayout; // This line alone isn't enough to trigger a re-render
        layout = [...layout]; // This line forces Svelte to see the array changes
        saveLayout(layout);
      }
    }

    dragging = null;
    targetIndex = -1;
  };

  function loadLayout(): Item[] | null {
    const storedLayout = localStorage.getItem('budgetAppLayout');
    return storedLayout ? JSON.parse(storedLayout) : null;
  }

  function saveLayout(layout: Item[]) {
    localStorage.setItem('budgetAppLayout', JSON.stringify(layout));
  }
</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each layout as item, index (item.id)}
      {#if dragging?.id !== item.id} 
        <div
          class="bg-gray-800 p-4 rounded-md h-64"
          data-id={item.id}
          draggable="true"
          on:dragstart={(event) => handleDragStart(event, index)}
          on:dragover={(event) => handleDragOver(event, index)}
          on:dragend={handleDragEnd}
        >
          {#if item.id === 'budget-display'}
            <BudgetDisplay balance={balance} />
          {:else if item.id === 'transaction-list'}
            <TransactionList transactions={transactions} />
          {/if}
        </div>
      {/if}
    {/each}

    <div
      class="bg-gray-800 p-4 rounded-md col-span-full"
      data-id="budget-input"
      draggable="true"
      on:dragstart={(event) => handleDragStart(event, layout.length)} 
      on:dragover={(event) => handleDragOver(event, layout.length)} 
      on:dragend={handleDragEnd}
    >
      <BudgetInput on:add={handleAddTransaction} />
    </div>
  </div>
</main>