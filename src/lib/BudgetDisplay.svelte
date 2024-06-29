<script lang="ts">
    export let balance: number = 0;
</script>
  
<div class="bg-gray-800 p-4 rounded-md">
    <h2 class="text-lg font-semibold mb-2">Current Balance</h2>
    <p class={balance >= 0 ? 'text-green-400' : 'text-red-400'}>
      {balance.toFixed(2)}
    </p>
</div>