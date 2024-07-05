<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let investmentPercentage: number = 0;

  const handleSave = () => {
    dispatch('save', { investmentPercentage });
  };
</script>

<div class="bg-gray-800 p-4 rounded-md mt-4">
  <h2 class="text-lg font-semibold mb-2">Investment Percentage</h2>
  <input
    type="number"
    placeholder="Investment Percentage"
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

<style>
  .bg-gray-800 {
    background-color: #2d3748;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .font-semibold {
    font-weight: 600;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .bg-gray-700 {
    background-color: #4a5568;
  }

  .text-white {
    color: #ffffff;
  }

  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .w-full {
    width: 100%;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .bg-green-500 {
    background-color: #48bb78;
  }

  .hover\:bg-green-600:hover {
    background-color: #38a169;
  }

  .text-white {
    color: #ffffff;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
</style>
