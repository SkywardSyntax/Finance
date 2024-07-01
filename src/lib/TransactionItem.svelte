<script>
  import { createEventDispatcher } from 'svelte';
  import TagSelectionModal from './TagSelectionModal.svelte';

  export let transaction = { description: '', amount: 0, tags: [] };

  const dispatch = createEventDispatcher();
  let showTagOptions = false;

  function deleteTransaction() {
    dispatch('delete', transaction);
  }

  function handleTagSelection(tag) {
    if (!transaction.tags.includes(tag)) {
      transaction.tags = [...transaction.tags, tag];
    }
    showTagOptions = false;
  }
</script>

<style>
  .transaction-item {
    border-radius: 16px;
    padding: 10px;
    position: relative;
    transition: background-color 0.3s, opacity 0.3s;
  }
  .transaction-item:hover {
    background-color: red;
  }
  .content {
    opacity: 1;
  }
  .transaction-item:hover .content {
    opacity: 0;
  }
  .delete-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    display: none;
  }
  .transaction-item:hover .delete-icon {
    display: block;
  }
  .tags-button {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .tag-icon {
    margin-right: 5px;
  }
</style>

<div class="transaction-item" on:click={deleteTransaction}>
  <div class="content">
    <h2>{transaction.description}</h2>
    <p>{transaction.amount}</p>
    <div class="tags-button" on:click|stopPropagation={() => showTagOptions = true}>
      <span class="tag-icon">🏷️</span> Add Tags
    </div>
    {#each transaction.tags as tag}
      <span>{tag}</span>
    {/each}
  </div>
  <div class="delete-icon">🗑️</div>
  {#if showTagOptions}
    <TagSelectionModal on:select={event => handleTagSelection(event.detail)} />
  {/if}
</div>
