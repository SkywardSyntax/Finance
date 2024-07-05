<script>
  import { createEventDispatcher } from 'svelte';
  import TagPopup from './TagPopup.svelte';

  export let transaction;
  const dispatch = createEventDispatcher();

  let showPopup = false;
  let tags = [];
  let customTag = '';
  let isEditingCost = false;
  let editedCost = transaction.cost;

  const togglePopup = () => {
    showPopup = !showPopup;
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      tags = [...tags, tag];
    }
  };

  const handleCustomTag = () => {
    if (customTag && !tags.includes(customTag)) {
      tags = [...tags, customTag];
      customTag = '';
    }
  };

  const handleSubmit = () => {
    dispatch('updateTags', { transactionId: transaction.id, tags });
    togglePopup();
  };

  const handleCancel = () => {
    togglePopup();
  };

  const handleCostInput = (event) => {
    editedCost = parseFloat(event.target.value);
  };

  const toggleCostEditing = () => {
    isEditingCost = !isEditingCost;
    if (!isEditingCost) {
      dispatch('updateCost', { transactionId: transaction.id, cost: editedCost });
    }
  };
</script>

<div class="mini-transaction-chip">
  <div class="left-side">
    <div class="name">{transaction.description}</div>
    <button class="add-tags" on:click={togglePopup}>Add tags</button>
    {#each tags as tag}
      <div class="tag-chip">{tag}</div>
    {/each}
  </div>
  <div class="right-side">
    {#if isEditingCost}
      <input
        type="number"
        value={editedCost}
        on:input={handleCostInput}
        on:blur={toggleCostEditing}
        class="cost-input"
        placeholder="Enter Amount Here"
      />
    {:else}
      <div class="cost" on:click={toggleCostEditing}>${transaction.cost}</div>
    {/if}
  </div>
</div>

{#if showPopup}
  <TagPopup {tags} on:submit={handleSubmit} on:close={handleCancel} />
{/if}

<style>
  .mini-transaction-chip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: background-color 0.3s, transform 0.3s;
  }

  .mini-transaction-chip:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 1rem;
    font-weight: bold;
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
    transition: background-color 0.3s, color 0.3s;
  }

  .tag-chip:hover {
    background-color: #cbd5e1;
    color: #111827;
  }

  .cost-input {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f7fafc;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    border-bottom: 2px solid #63b3ed;
    outline: none;
    width: 100px;
  }
</style>
