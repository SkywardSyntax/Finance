<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let tags = ['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transport'];

  function selectTag(tag) {
    dispatch('tagSelected', { tag });
  }
</script>

<style>
  .tag-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 20px;
    background-color: #f3f4f6;
    border-radius: 8px;
  }
  .tag-option {
    padding: 10px;
    background-color: #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .tag-option:hover {
    background-color: #cbd5e1;
  }
</style>

<div class="tag-options">
  {#each tags as tag}
    <div class="tag-option" on:click={() => selectTag(tag)}>
      {tag}
    </div>
  {/each}
</div>
