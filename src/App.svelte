<script>
  import BudgetInput from './lib/BudgetInput.svelte';
  import BalanceChip from './lib/BalanceChip.svelte';

  let transactions = [];
  let annualSalary = 0;
  let remainingBalance = 0;

  const handleAddTransaction = (event) => {
    const transaction = event.detail;
    transactions = [...transactions, transaction];
    remainingBalance -= transaction.cost;
  };

  const handleSalaryInput = (event) => {
    annualSalary = parseFloat(event.target.value);
    remainingBalance = annualSalary;
  };
</script>

<main class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-2xl font-bold mb-4">Budget Tracker</h1>

  <div class="mb-4">
    <label for="salary" class="block text-sm font-medium text-gray-300">Annual Salary</label>
    <input
      type="number"
      id="salary"
      on:input={handleSalaryInput}
      class="bg-gray-700 text-white rounded-md px-2 py-1 w-full"
    />
  </div>

  <BudgetInput on:add={handleAddTransaction} />

  <div class="mt-4">
    <h2 class="text-lg font-semibold mb-2">Transactions</h2>
    <ul>
      {#each transactions as transaction}
        <li>{transaction.description} - ${transaction.cost}</li>
      {/each}
    </ul>
  </div>

  <BalanceChip {remainingBalance} />
</main>
