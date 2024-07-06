<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let investmentPercentage = 0; 

  const handleSave = () => {
    dispatch('save', { investmentPercentage });
  };
</script>

<div class="bg-gray-800 p-4 rounded-md">
  <h2 class="text-lg font-semibold mb-2">Set Investment Percentage</h2>
  <input
    type="number"
    placeholder="Enter percentage"
    bind:value={investmentPercentage}
    class="bg-gray-700 text-white rounded-md px-2 py-1 w-full mb-2"
  />
  <button
    on:click={handleSave}
    class="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2"
  >
    Save
  </button>
</div>