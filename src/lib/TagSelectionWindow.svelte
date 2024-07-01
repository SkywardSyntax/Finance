<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let tags = ['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transport'];

  function selectTag(tag) {
    dispatch('tagSelected', { tag });
  }
</script>

<style>
  .tag-selection-window {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: auto;
    max-width: 500px;
  }

  .tag-option {
    display: inline-block;
    margin: 5px;
    padding: 10px 15px;
    background-color: #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .tag-option:hover {
    background-color: #cbd5e1;
  }
</style>

<div class="tag-selection-window">
  {#each tags as tag}
    <div class="tag-option" on:click={() => selectTag(tag)}>
      {tag}
    </div>
  {/each}
</div>
