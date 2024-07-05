<script>
  import BudgetInput from './lib/BudgetInput.svelte';
  import BalanceChip from './lib/BalanceChip.svelte';
  import TransactionItem from './lib/TransactionItem.svelte';
  import InvestmentInput from './lib/InvestmentInput.svelte';
  import PieChart from './lib/PieChart.svelte';

  let transactions = [];
  let annualSalary = 0;
  let remainingBalance = 0;
  let showSalaryInput = false;
  let investmentPercentage = 0;
  let investmentAmount = 0;

  const handleAddTransaction = (event) => {
    const transaction = event.detail;
    transactions = [...transactions, transaction];
    remainingBalance -= transaction.cost;
  };

  const handleSalaryInput = (event) => {
    annualSalary = parseFloat(event.target.value);
    remainingBalance = annualSalary - investmentAmount;
  };

  const toggleSalaryInput = () => {
    showSalaryInput = !showSalaryInput;
  };

  const handleUpdateTags = (event) => {
    const { transactionId, tag } = event.detail;
    transactions = transactions.map(transaction => 
      transaction.id === transactionId ? { ...transaction, tag } : transaction
    );
  };

  const handleSaveInvestment = (event) => {
    investmentPercentage = event.detail.investmentPercentage;
    investmentAmount = (annualSalary * investmentPercentage) / 100;
    remainingBalance = annualSalary - investmentAmount;
  };

  const calculatePercentages = () => {
    const totalIncome = annualSalary;
    const tagAmounts = {};
    let otherAmount = 0;

    transactions.forEach(transaction => {
      if (transaction.tag) {
        if (!tagAmounts[transaction.tag]) {
          tagAmounts[transaction.tag] = 0;
        }
        tagAmounts[transaction.tag] += transaction.cost;
      } else {
        otherAmount += transaction.cost;
      }
    });

    const tagPercentages = {};
    for (const tag in tagAmounts) {
      tagPercentages[tag] = (tagAmounts[tag] / totalIncome) * 100;
    }

    const otherPercentage = (otherAmount / totalIncome) * 100;

    return {
      investmentPercentage,
      investmentAmount,
      tagPercentages,
      otherPercentage
    };
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
      <InvestmentInput on:save={handleSaveInvestment} />
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

  {#if annualSalary > 0}
    <PieChart {...calculatePercentages()} />
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #1a202c;
    color: #f1f5f9;
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .mb-6 {
    margin-bottom: 1.5rem;
  }

  .bg-gray-700 {
    background-color: #2d3748;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .w-full {
    width: 100%;
  }

  .bg-green-500 {
    background-color: #48bb78;
  }

  .rounded-full {
    border-radius: 9999px;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .mt-6 {
    margin-top: 1.5rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .font-semibold {
    font-weight: 600;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
