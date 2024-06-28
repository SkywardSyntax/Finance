<script>
  export let totalIncome;
  export let item; 
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';

  const handleIncomeChange = (event) => {
    totalIncome = parseFloat(event.target.value) || 0; 
  };

  const handleDndUpdate = ({ detail }) => {
    item.x = detail.x; 
    item.y = detail.y; 
  };
</script>

<div 
  class="input-card"
  use:dndzone={{
    items: [{ id: item.id }], 
    flipDurationMs: 200,
  }}
  on:dndzone:reorder={handleDndUpdate}
  style="cursor: {$dragging ? 'grabbing' : 'grab'}" 
>
  <div class="input-content">
    <h2>Enter Your Monthly Income</h2> 
    <input type="number" id="annual-income" placeholder="E.g., 5000" on:input={handleIncomeChange} />
  </div>
  <button on:click={() => { console.log('Set Income button clicked, but no action defined yet.');}}> 
    Set Income
  </button>
</div>

<style>
  .input-card {
    background-color: #202020;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: fit-content;
    z-index: 1; 
  }

  .input-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  h2 {
    color: #eee;
    margin-bottom: 15px;
  }

  input[type="number"] {
    width: calc(100% - 16px);
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #555;
    background-color: #444;
    color: #eee;
    margin-bottom: 10px;
  }

  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>