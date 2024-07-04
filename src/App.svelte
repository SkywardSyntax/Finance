<script>
  import BudgetInput from './lib/BudgetInput.svelte';
  import BalanceChip from './lib/BalanceChip.svelte';
  import TransactionItem from './lib/TransactionItem.svelte';

  let transactions = [];
  let annualSalary = 0;
  let remainingBalance = 0;
  let showSalaryInput = false;

  const handleAddTransaction = (event) => {
    const transaction = event.detail;
    transactions = [...transactions, transaction];
    remainingBalance -= transaction.cost;
  };

  const handleSalaryInput = (event) => {
    annualSalary = parseFloat(event.target.value);
    remainingBalance = annualSalary;
    showSalaryInput = false;
  };

  const toggleSalaryInput = () => {
    showSalaryInput = !showSalaryInput;
  };

  // Updated to handle single tag updates
  const handleUpdateTags = (event) => {
    const { transactionId, tag } = event.detail;
    transactions = transactions.map(transaction => 
      transaction.id === transactionId ? { ...transaction, tag } : transaction
    );
  };
</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-3xl font-extrabold mb-6">Budget Tracker</h1>

  <div class="mb-6">
    {#if showSalaryInput}
      <input
        type="number"
        id="salary"
        on:input={handleSalaryInput}
        class="bg-gray-700 text-white rounded-md px-3 py-2 w-full"
        placeholder="Enter Annual Income Here"
      />
    {:else}
      <button
        on:click={toggleSalaryInput}
        class="bg-green-500 text-white rounded-full px-4 py-2"
      >
        Enter Annual Income Here
      </button>
    {/if}
  </div>

  <BudgetInput on:add={handleAddTransaction} />

  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-4">Transactions</h2>
    <ul>
      {#each transactions as transaction}
        <TransactionItem {transaction} on:updateTags={handleUpdateTags} />
      {/each}
    </ul>
  </div>

  <BalanceChip {remainingBalance} />
</main>
