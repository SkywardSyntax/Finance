<script>
  import BudgetInput from './lib/BudgetInput.svelte';

  let transactions = [];

  const handleAddTransaction = (event) => {
    const transaction = event.detail;
    transactions = [...transactions, transaction];
  };
</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-2xl font-bold mb-4">Budget Tracker</h1>

  <BudgetInput on:add={handleAddTransaction} />

  <div class="mt-4">
    <h2 class="text-lg font-semibold mb-2">Transactions</h2>
    <ul>
      {#each transactions as transaction}
        <li>{transaction.description}</li>
      {/each}
    </ul>
  </div>
</main>
