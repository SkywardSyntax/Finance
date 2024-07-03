<script>
  export let remainingBalance;
</script>

<div class="balance-chip">
  <span>Remaining Balance: ${remainingBalance}</span>
</div>

<style>
  .balance-chip {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
  }
</style>
