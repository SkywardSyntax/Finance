<script>
  export let remainingBalance;
</script>

<div class="balance-chip">
  <span>Remaining Balance: ${remainingBalance.toFixed(2)}</span>
</div>

<style>
  .balance-chip {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    background-color: #38a169;
    color: white;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 700;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.3s;
  }

  .balance-chip:hover {
    background-color: #2f855a;
    transform: scale(1.05);
  }
</style>
