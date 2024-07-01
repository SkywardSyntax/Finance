<script>
  export let tag = '';
</script>

<style>
  .tag {
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

  .tag:hover {
    background-color: #cbd5e1;
    color: #111827;
  }
</style>

<div class="tag">{tag}</div>
