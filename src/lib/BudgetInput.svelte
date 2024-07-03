<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let description = '';
  
    const handleAdd = () => {
      const transaction = {
        description
      };
  
      description = '';
  
      dispatch('add', transaction);
    };
</script>
  
<div class="bg-gray-800 p-4 rounded-md">
    <h2 class="text-lg font-semibold mb-2">Add Transaction</h2>
    <input
      type="text"
      placeholder="Description"
      bind:value={description}
      class="bg-gray-700 text-white rounded-md px-2 py-1 w-full mb-2"
    />
    <button
      on:click={handleAdd}
      class="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2"
    >
      Add
    </button>
</div>
