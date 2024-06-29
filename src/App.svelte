<script lang="ts">
  import BudgetInput from './lib/BudgetInput.svelte';
  import TransactionList from './lib/TransactionList.svelte';
  import BudgetDisplay from './lib/BudgetDisplay.svelte';

  let balance: number = 0;
  let transactions: { description: string; amount: number }[] = [];

  const handleAddTransaction = (event: CustomEvent<{ description: string; amount: number }>) => {
    const transaction = event.detail; // Access transaction from event.detail

    transactions = [...transactions, transaction]; 
    updateBalance(transaction.amount);
  };

  const updateBalance = (amount: number) => {
    balance += amount;
  };
</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-2xl font-bold mb-4">Budget Tracker</h1>

  <BudgetInput on:add={handleAddTransaction} />

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <BudgetDisplay balance={balance} />
    <TransactionList transactions={transactions} />
  </div>
</main>