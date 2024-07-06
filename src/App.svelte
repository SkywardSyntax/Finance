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
  let showPieChart = false;

  $: chartData = calculatePercentages(); 

  const handleAddTransaction = (event) => {
    const transaction = event.detail;
    transactions = [...transactions, { ...transaction, tag: 'Other', id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) }];
    remainingBalance = annualSalary * (1 - investmentPercentage / 100) - transactions.reduce((sum, t) => sum + t.cost, 0);
    chartData = calculatePercentages();
  };

  const handleSalaryInput = (event) => {
    annualSalary = parseFloat(event.target.value);
    remainingBalance = annualSalary * (1 - investmentPercentage / 100) - transactions.reduce((sum, t) => sum + t.cost, 0); 
    chartData = calculatePercentages(); 
  };

  const toggleSalaryInput = () => {
    showSalaryInput = !showSalaryInput;
  };

  const handleUpdateTags = (event) => {
    const { transactionId, tag } = event.detail;
    transactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, tag } : transaction
    );
    chartData = calculatePercentages();
  };


  const handleSaveInvestment = (event) => {
    investmentPercentage = event.detail.investmentPercentage;
    showPieChart = true;
    remainingBalance = annualSalary * (1 - investmentPercentage / 100) - transactions.reduce((sum, t) => sum + t.cost, 0);
    chartData = calculatePercentages();
  };

  const calculatePercentages = () => {
    const tagAmounts = { Other: 0 };

    transactions.forEach(transaction => {
      if (!tagAmounts[transaction.tag]) {
        tagAmounts[transaction.tag] = 0;
      }
      tagAmounts[transaction.tag] += transaction.cost;
    });

    // Calculate the total spent across all tags
    const totalSpent = Object.values(tagAmounts).reduce((sum, val) => sum + val, 0);

    // Calculate Remaining Income
    const remainingIncome = annualSalary - (annualSalary * (investmentPercentage / 100)) - totalSpent;

    const data = {
      labels: ['Investment', ...Object.keys(tagAmounts), 'Remaining Income'], 
      datasets: [{
        data: [
          annualSalary * (investmentPercentage / 100), 
          ...Object.values(tagAmounts), 
          remainingIncome 
        ],
        backgroundColor: [
          '#22c55e', // Green for Investment
          '#ef4444', // Red for Other 
          '#3b82f6', // Blue for Remaining Income
          '#8b5cf6',
          '#a855f7',
          '#0ea5e9',
          '#f97316', 
          '#f59e0b', 
          '#eab308', 
        ],
      }],
    };

      return data;
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
      {#each transactions as transaction (transaction.id)} 
        <TransactionItem {transaction} on:updateTags={handleUpdateTags} on:updateCost={(event) => {
          const { cost } = event.detail;
          transaction.cost = cost; 
          remainingBalance = annualSalary - transactions.reduce((sum, t) => sum + t.cost, 0); 
          chartData = calculatePercentages(); 
        }}/>
      {/each}
    </ul>
  </div>

  <BalanceChip {remainingBalance} />

  {#if showPieChart} 
    <div class="chart-container">
      <PieChart data={chartData} /> 
    </div>
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

  .chart-container {
    width: 400px;
    height: 400px;
  }
</style>