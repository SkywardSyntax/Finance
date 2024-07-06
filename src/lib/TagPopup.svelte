<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const selectTag = (tag) => {
    dispatch('tagSelect', { tag });
  };
</script>

<div class="popup">
  <div class="popup-content">
    <h3>Select Tag</h3>
    <div class="tags">
      <div class="tag-chip" on:click={() => selectTag('Food')}>Food</div>
      <div class="tag-chip" on:click={() => selectTag('Transport')}>Transport</div>
      <div class="tag-chip" on:click={() => selectTag('Rent')}>Rent</div>
      <div class="tag-chip" on:click={() => selectTag('Utilities')}>Utilities</div>
      <div class="tag-chip" on:click={() => selectTag('Other')}>Other</div> 
    </div>
  </div>
</div>


<style>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .popup-content {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    width: 300px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #e2e8f0;
    color: #333;
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .tag-chip:hover {
    background-color: #cbd5e1;
    color: #111827;
  }
</style>