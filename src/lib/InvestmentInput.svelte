<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let investmentPercentage: number = 0;

  const handleSave = () => {
    dispatch('save', { investmentPercentage });
  };
</script>

<div class="investment-input">
  <h2>Investment Percentage</h2>
  <input
    type="number"
    placeholder="Enter Investment Percentage"
    bind:value={investmentPercentage}
  />
  <button on:click={handleSave}>
    Save
  </button>
</div>
