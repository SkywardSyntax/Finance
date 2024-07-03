<script>
  import { createEventDispatcher } from 'svelte';
  import TagPopup from './TagPopup.svelte';

  export let transaction;
  const dispatch = createEventDispatcher();

  let showPopup = false;
  let selectedTag = null; // Store the selected tag

  const togglePopup = () => {
    showPopup = !showPopup;
  };

  // Handle tag selection from the popup
  const handleTagSelect = (event) => {
    selectedTag = event.detail.tag; 
    showPopup = false; // Close the popup
    dispatch('updateTags', { transactionId: transaction.id, tag: selectedTag }); 
  };
</script>

<div class="transaction-chip">
  <div class="left-side">
    <div class="name">{transaction.description}</div>
    {#if selectedTag}
      <div class="tag-chip">{selectedTag}</div> 
    {:else}
      <button class="add-tags" on:click={togglePopup}>Add tags</button> 
    {/if}
  </div>
  <div class="right-side">
    <div class="cost">${transaction.cost}</div>
  </div>
</div>

{#if showPopup}
  <TagPopup on:tagSelect={handleTagSelect} />
{/if}

<style>
  .transaction-chip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: #2d3748;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: background-color 0.3s, transform 0.3s;
  }

  .transaction-chip:hover {
    background-color: #4a5568;
    transform: scale(1.02);
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #e2e8f0;
  }

  .add-tags {
    font-size: 0.875rem;
    color: #63b3ed;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
  }

  .add-tags:hover {
    color: #4299e1;
  }

  .right-side {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f7fafc;
  }

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

  .popup-buttons {
    display: flex;
    justify-content: space-between;
  }

  .popup-buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .popup-buttons button:first-child {
    background-color: #4caf50;
    color: white;
  }

  .popup-buttons button:last-child {
    background-color: #f44336;
    color: white;
  }
</style>
