<script>
  import { createEventDispatcher } from 'svelte';
  import TagSelectionModal from './TagSelectionModal.svelte';

  const dispatch = createEventDispatcher();
  let showTagOptions = false;

  export let transaction = { description: '', amount: 0, tags: [] };

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
  .transaction-chip {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    border-radius: 16px;
    transition: background-color 0.3s, opacity 0.3s;
    position: relative;
  }

  .transaction-chip:hover {
    background-color: red;
  }

  .content {
    opacity: 1;
  }

  .transaction-chip:hover .content {
    opacity: 0;
  }

  .delete-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    display: none;
  }

  .transaction-chip:hover .delete-icon {
    display: block;
  }

  .tags-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 8px;
  }

  .tag-icon {
    margin-right: 5px;
  }
</style>

<div class="transaction-chip" on:click={deleteTransaction}>
  <div class="content">
    <h2>{transaction.description}</h2>
    <div class="tags-button" on:click|stopPropagation={() => showTagOptions = true}>
      <span class="tag-icon">🏷️</span> Add Tags
    </div>
    {#each transaction.tags as tag}
      <span>{tag}</span>
    {/each}
  </div>
  <div class="delete-icon">🗑️</div>
  {#if showTagOptions}
    <TagSelectionModal on:tagSelected={event => handleTagSelection(event.detail)} />
  {/if}
</div>
