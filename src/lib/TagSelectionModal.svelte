<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let tags = ['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transport'];

  function selectTag(tag) {
    dispatch('tagSelected', { tag });
  }
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .tag {
    display: inline-block;
    margin: 5px;
    padding: 10px 15px;
    background-color: #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .tag:hover {
    background-color: #cbd5e1;
  }
</style>

<div class="modal" on:click={() => dispatch('close')}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Select Tags</h2>
    <div>
      {#each tags as tag}
        <div class="tag" on:click={() => selectTag(tag)}>{tag}</div>
      {/each}
    </div>
  </div>
</div>
