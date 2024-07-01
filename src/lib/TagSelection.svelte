<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let tags = ['Groceries', 'Utilities', 'Rent', 'Entertainment', 'Transport'];

  function selectTag(tag) {
    dispatch('tagSelected', { tag });
  }

  function closeModal() {
    dispatch('closeModal');
  }
</script>

<style>
  .modal-background {
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

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
  }

  .tag-button {
    display: inline-block;
    margin: 5px;
    padding: 10px 15px;
    background-color: #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .tag-button:hover {
    background-color: #cbd5e1;
  }
</style>

<div class="modal-background" on:click={closeModal}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Select a Tag</h2>
    <div>
      {#each tags as tag}
        <div class="tag-button" on:click={() => selectTag(tag)}>{tag}</div>
      {/each}
    </div>
  </div>
</div>
