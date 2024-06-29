<script lang="ts">
    export let transactions: { description: string; amount: number }[] = [];
</script>
  
<div class="bg-gray-800 p-4 rounded-md">
    <h2 class="text-lg font-semibold mb-2">Transactions</h2>
    <ul class="divide-y divide-gray-700">
      {#each transactions as transaction}
        <li class="flex items-center justify-between py-2">
          <span>{transaction.description}</span>
          <span class={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
            {transaction.amount.toFixed(2)}
          </span>
        </li>
      {/each}
    </ul>
</div>